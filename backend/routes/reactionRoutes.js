const express = require('express');
const {
  likeBlog,
  unlikeBlog,
  getLikeStatus
} = require('../controllers/reactionController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { requireStudent } = require('../middleware/authorize');

const router = express.Router();

// GET /api/blogs/:id/like-status - Get like status (authenticated users)
router.get('/:id/like-status', authenticate, getLikeStatus);

// POST /api/blogs/:id/like - Like a blog (student only)
router.post('/:id/like', authenticate, requireStudent, likeBlog);

// DELETE /api/blogs/:id/like - Unlike a blog (student only)
router.delete('/:id/like', authenticate, requireStudent, unlikeBlog);

module.exports = router;
