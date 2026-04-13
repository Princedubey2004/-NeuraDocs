const express = require('express');
const { summarizeText, rewriteText, fixGrammar } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// protect all AI routes
router.use(protect);

router.post('/summarize', summarizeText);
router.post('/rewrite', rewriteText);
router.post('/fix-grammar', fixGrammar);

module.exports = router;
