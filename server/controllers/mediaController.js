const { searchYouTubeVideo } = require('../services/youtubeService');

const getYouTubeVideo = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ success: false, error: 'Query parameter "q" is required.' });
        }
        const video = await searchYouTubeVideo(q);
        res.status(200).json({ success: true, data: video });
    } catch (error) {
        console.error('YouTube Controller Error:', error);
        res.status(500).json({ success: false, error: 'Failed to search YouTube video.' });
    }
};
module.exports = { getYouTubeVideo };