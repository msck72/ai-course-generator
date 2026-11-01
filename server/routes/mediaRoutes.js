const express = require('express');
const router = express.Router();
const { getYouTubeVideo } = require('../controllers/mediaController');

router.get('/youtube', getYouTubeVideo);

module.exports = router;