const express = require('express');
const router = express.Router();
const {
    generateCourse,
    getCourses,
    getCourseById,
    deleteCourse,
    enrichLesson,
    getLessonById,
} = require('../controllers/courseController');

router.post('/generate', generateCourse);
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.delete('/:id', deleteCourse);

router.post('/lessons/:id/enrich', enrichLesson);
router.get('/lessons/:id', getLessonById);

module.exports = router;