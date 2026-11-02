const express = require('express');
const router = express.Router();
const { getYouTubeVideo, getHinglishAudioNarration } = require('../controllers/mediaController');

router.get('/youtube', getYouTubeVideo);
router.post('/hinglish', getHinglishAudioNarration);

module.exports = router;