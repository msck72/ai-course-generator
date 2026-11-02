const { searchYouTubeVideo } = require('../services/youtubeService');
const { generateHinglishNarration } = require('../services/geminiService');

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

const narrationCache = new Map();

const getHinglishAudioNarration = async (req, res) => {
    try {
        const { lessonId, title, content } = req.body;
        if (!lessonId || !title) {
            return res.status(400).json({
                success: false,
                error: 'lessonId and title are required.'
            });
        }

        if (narrationCache.has(lessonId)) {
            return res.status(200).json({
                success: true,
                data: {
                    script: narrationCache.get(lessonId)
                }
            });
        }

        const summary = Array.isArray(content) ? content.map(b => b.value || b.text || b.question || '').join(' ').substring(0, 1000) : (content || title);
        const script = await generateHinglishNarration(title, summary);
        narrationCache.set(lessonId, script);

        res.status(200).json({
            success: true, data: {
                script
            }
        });
    } catch (err) {
        console.error('Hinglish controller error: ', err);
        res.status(500).json({
            success: false,
            error: 'Failed to generaete Hinglish narration.'
        });
    }
}

module.exports = { getYouTubeVideo, getHinglishAudioNarration };