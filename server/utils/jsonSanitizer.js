/**
 * Strips markdown fences and safely parses JSON returned by Gemini.
 */
const sanitizeAndParseJSON = (rawText) => {
    if (!rawText || typeof rawText !== 'string') {
        throw new Error('Invalid AI response: Expected text output.');
    }

    let cleaned = rawText.trim();
    if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
        cleaned = cleaned.replace(/\s*```$/, '');
    }

    try {
        return JSON.parse(cleaned);
    } catch (error) {
        console.error('Failed to parse JSON string:', cleaned);
        throw new Error(`JSON Parse Error: ${error.message}`);
    }
};

module.exports = { sanitizeAndParseJSON };