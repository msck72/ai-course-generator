const { GoogleGenAI } = require('@google/genai');
const { courseOutlinePrompt, lessonEnrichPrompt } = require('../utils/promptTemplates');
const { sanitizeAndParseJSON } = require('../utils/jsonSanitizer');

const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not defined in server/.env');
    }
    return new GoogleGenAI({ apiKey });
};

const CANDIDATE_MODELS = [
    process.env.GEMINI_MODEL,
    'gemini-flash-latest',
    'gemini-pro-latest',
].filter(Boolean);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateWithFallback = async (ai, contents, config) => {
    let lastError = null;

    for (const model of CANDIDATE_MODELS) {
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                console.log(`🤖 Querying Gemini using model: ${model} (attempt ${attempt})...`);
                const response = await ai.models.generateContent({
                    model,
                    contents,
                    config,
                });
                return response;
            } catch (err) {
                lastError = err;
                const msg = err.message || '';
                console.warn(`⚠️ Model ${model} attempt ${attempt} error: ${msg}`);

                if (msg.includes('503') || msg.includes('high demand') || msg.includes('overloaded')) {
                    console.log('⏳ Gemini is busy, waiting 2s before retry...');
                    await sleep(2000);
                } else {
                    break;
                }
            }
        }
    }
    throw lastError;
};

const generateCourseOutline = async (topic) => {
    const ai = getGeminiClient();
    const prompt = courseOutlinePrompt(topic);

    const response = await generateWithFallback(ai, prompt, {
        responseMimeType: 'application/json',
        temperature: 0.7,
    });

    return sanitizeAndParseJSON(response.text);
};

const generateLessonContent = async (courseTitle, moduleTitle, lessonTitle) => {
    const ai = getGeminiClient();
    const prompt = lessonEnrichPrompt(courseTitle, moduleTitle, lessonTitle);

    const response = await generateWithFallback(ai, prompt, {
        responseMimeType: 'application/json',
        temperature: 0.7,
    });

    return sanitizeAndParseJSON(response.text);
};

module.exports = {
    generateCourseOutline,
    generateLessonContent,
};