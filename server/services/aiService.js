const { OpenAI } = require('openai');
const ErrorResponse = require('../utils/errorResponse');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Quick wrappers for OpenAI ops. 
 * Kept thin as possible to stay within rate limits.
 */

exports.summarizeText = async (text) => {
    try {
        const res = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'Summarize the user text concisely.' },
                { role: 'user', content: text }
            ],
            max_tokens: 200
        });

        return res.choices[0].message.content.trim();
    } catch (err) {
        console.error('[AI] OpenAI summarizes failed:', err.message);
        throw new ErrorResponse('AI Engine is currently unavailable.', 502);
    }
};

exports.rewriteText = async (text, tone = 'professional') => {
    try {
        const res = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: `Rewrite the following text in a ${tone} tone.` },
                { role: 'user', content: text }
            ]
        });

        return res.choices[0].message.content.trim();
    } catch (err) {
        console.error('[AI] Rewrite failed:', err.message);
        throw new ErrorResponse('Failed to rewrite text.', 502);
    }
};

exports.fixGrammar = async (text) => {
    try {
        const res = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'Act as an editor. Fix grammar/spelling. Return ONLY the fixed text.' },
                { role: 'user', content: text }
            ]
        });

        return res.choices[0].message.content.trim();
    } catch (err) {
        console.error('[AI] Grammar check failed:', err.message);
        throw new ErrorResponse('Could not process grammar check.', 502);
    }
};
