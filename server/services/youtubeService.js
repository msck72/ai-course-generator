const axios = require('axios');

const videoCache = new Map();

const searchYoutubeVideo = async (query) => {
    if (!query || typeof query !== 'string') return null;

    const cleanQuery = query.trim();
    if (videoCache.has(cleanQuery)) {
        console.log(`Youtube cache hit for : "${cleanQuery}"`);
        return videoCache.get(cleanQuery);
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        return {
            videoId: null,
            title: cleanQuery,
            query: cleanQuery,
            fallbackUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanQuery)}`,
        };
    }

    try {
        console.log(`Searching Youtube API for: "${cleanQuery}"`);
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: `${cleanQuery} tutorial`,
                type: 'video',
                videoEmbeddable: 'true',
                maxResults: 1,
                key: apiKey,
            },
        });

        const item = response.data.items?.[0];
        if (!item) {
            return {
                videoId: null,
                title: cleanQuery,
                query: cleanQuery,
                fallbackUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanQuery)}`,
            };
        }

        const videoData = {
            videoId: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails?.medium?.url,
            query: cleanQuery,
        };

        videoCache.set(cleanQuery, videoData);
        return videoData;

    } catch (err) {
        console.warn('Youtube search error, using fallback: ', err.message);
        return {
            videoId: null,
            title: cleanQuery,
            query: cleanQuery,
            fallbackUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanQuery)}`,
        };
    }
};

module.exports = { searchYoutubeVideo };