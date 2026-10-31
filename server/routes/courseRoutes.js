const express = require('express');
const router = express.Router();
const {
    generateCourse,
    getCourses,
    getCourseById,
    enrichLesson,
    getLessonById,
} = require('../controllers/courseController');

router.post('/generate', generateCourse);
router.get('/', getCourses);
router.get('/:id', getCourseById);

router.post('/lessons/:id/enrich', enrichLesson);
router.get('/lessons/:id', getLessonById);

module.exports = router;