const { summarizeText, rewriteText, fixGrammar: fixTextGrammar } = require('../services/aiService');
const ErrorResponse = require('../utils/errorResponse');

exports.summarizeText = async (req, res, next) => {
    try {
        const { text } = req.body;
        if (!text) return next(new ErrorResponse('Missing text content', 400));

        const result = await summarizeText(text);
        res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
};

exports.rewriteText = async (req, res, next) => {
    try {
        const { text, tone } = req.body;
        if (!text) return next(new ErrorResponse('Missing text content', 400));

        const result = await rewriteText(text, tone);
        res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
};

exports.fixGrammar = async (req, res, next) => {
    try {
        const { text } = req.body;
        if (!text) return next(new ErrorResponse('Missing text content', 400));

        const result = await fixTextGrammar(text);
        res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
};
