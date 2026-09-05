const express = require('express');
const { chat, getSuggestions } = require('../controllers/aiGuideController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/ai-guide/suggestions - Get starter prompt suggestions (auth required)
router.get('/suggestions', authenticate, getSuggestions);

// POST /api/ai-guide/chat - Send message to AI Guide (auth required)
router.post('/chat', authenticate, chat);

module.exports = router;
