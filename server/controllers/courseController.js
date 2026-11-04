const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const { generateCourseOutline, generateLessonContent } = require('../services/geminiService');

/**
 * @desc    Generate a new course from topic prompt and persist to MongoDB
 * @route   POST /api/courses/generate
 */
const generateCourse = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
            return res.status(400).json({ error: 'Please provide a valid topic prompt.' });
        }

        console.log(`Requesting Gemini course outline for: "${prompt.trim()}"...`);
        const outline = await generateCourseOutline(prompt.trim());

        const course = new Course({
            title: outline.title || prompt.trim(),
            description: outline.description || 'AI-generated course curriculum.',
            tags: outline.tags || [],
            creator: req.user?.sub || 'guest_user',
            creatorName: req.user?.name || (req.user?.email ? req.user.email.split('@')[0] : 'Learner'),
            creatorEmail: req.user?.email || '',
            modules: [],
        });
        await course.save();

        if (Array.isArray(outline.modules)) {
            for (const modData of outline.modules) {
                const moduleDoc = new Module({
                    title: modData.title,
                    course: course._id,
                    lessons: [],
                });
                await moduleDoc.save();

                if (Array.isArray(modData.lessons)) {
                    for (const lessonTitle of modData.lessons) {
                        const lessonDoc = new Lesson({
                            title: typeof lessonTitle === 'string' ? lessonTitle : lessonTitle.title,
                            module: moduleDoc._id,
                            objectives: [],
                            content: [],
                            isEnriched: false,
                        });
                        await lessonDoc.save();
                        moduleDoc.lessons.push(lessonDoc._id);
                    }
                    await moduleDoc.save();
                }

                course.modules.push(moduleDoc._id);
            }
            await course.save();
        }

        const populatedCourse = await Course.findById(course._id).populate({
            path: 'modules',
            populate: { path: 'lessons' },
        });

        res.status(201).json({
            success: true,
            data: populatedCourse,
        });
    } catch (error) {
        console.error('Course Generation Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate course',
        });
    }
};

/**
 * @desc    Get all courses
 * @route   GET /api/courses
 */
const getCourses = async (req, res) => {
    try {
        const { filter } = req.query;
        let query = {};

        if (filter === 'mine') {
            if (req.user?.sub) {
                query = { creator: req.user.sub };
            }
            else {
                query = { creator: 'guest_user' };
            }
        }

        const courses = await Course.find(query)
            .populate({
                path: 'modules',
                populate: { path: 'lessons' },
            })
            .sort({ createdAt: -1 });

        const coursesWithOwnership = courses.map((c) => {
            const obj = c.toObject();
            obj.isOwner = Boolean(req.user?.sub && c.creator === req.user.sub);
            return obj;
        });

        res.status(200).json({
            success: true,
            count: coursesWithOwnership.length,
            data: coursesWithOwnership,
        });
    } catch (error) {
        console.error('Get Courses Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * @desc    Get single course by ID
 * @route   GET /api/courses/:id
 */
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate({
            path: 'modules',
            populate: { path: 'lessons' },
        });

        if (!course) {
            return res.status(404).json({ success: false, error: 'Course not found' });
        }

        const courseData = course.toObject();
        courseData.isOwner = Boolean(req.user?.sub && course.creator === req.user.sub);

        res.status(200).json({ success: true, data: courseData });
    } catch (error) {
        console.error('Get Course Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * @desc    Enrich a lesson with rich content blocks (code, video query, MCQs)
 * @route   POST /api/lessons/:id/enrich
 */
const enrichLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id).populate({
            path: 'module',
            populate: { path: 'course' },
        });

        if (!lesson) {
            return res.status(404).json({ success: false, error: 'Lesson not found' });
        }

        const courseTitle = lesson.module?.course?.title || 'Course';
        const moduleTitle = lesson.module?.title || 'Module';
        const lessonTitle = lesson.title;

        console.log(`Enriching lesson: "${lessonTitle}"...`);
        const enrichedData = await generateLessonContent(courseTitle, moduleTitle, lessonTitle);

        lesson.objectives = enrichedData.objectives || [];
        lesson.content = enrichedData.content || [];
        lesson.isEnriched = true;

        await lesson.save();

        res.status(200).json({
            success: true,
            data: lesson,
        });
    } catch (error) {
        console.error('Enrich Lesson Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to enrich lesson',
        });
    }
};

/**
 * @desc    Get single lesson by ID
 * @route   GET /api/lessons/:id
 */
const getLessonById = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            return res.status(404).json({ success: false, error: 'Lesson not found' });
        }

        res.status(200).json({ success: true, data: lesson });
    } catch (error) {
        console.error('Get Lesson Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};


const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                error: 'Course not found'
            });
        }

        if (course.creator && course.creator !== 'guest_user') {
            if (!req.user || req.user.sub != course.creator) {
                return res.status(403).json({
                    success: false,
                    error: 'Permission denied: you can only delete courses you created.'
                });
            }
        }

        const modules = await Module.find({ course: course._id });

        for (const mod of modules) {
            if (mod.lessons && mod.lessons.length > 0) {
                await Lesson.deleteMany({ _id: { $in: mod.lessons } });
            }
        }

        await Module.deleteMany({ course: course._id });
        await Course.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Course and all associated lessons deleted successfully.',
        });
    } catch (err) {
        console.error('Delete Course Error: ', err);
        res.status(500).json({ success: false, error: err.message });
    }
}

module.exports = {
    generateCourse,
    getCourses,
    getCourseById,
    deleteCourse,
    enrichLesson,
    getLessonById,
};