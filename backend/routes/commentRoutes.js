const express = require('express');
const { body } = require('express-validator');
const {
  getCommentsByBlogId,
  createComment,
  deleteComment
} = require('../controllers/commentController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { requireStudent } = require('../middleware/authorize');
const { handleValidationErrors } = require('../middleware/validate');

const router = express.Router();

// GET /api/blogs/:id/comments - Get all comments for a blog (public)
router.get('/:id/comments', optionalAuth, getCommentsByBlogId);

// POST /api/blogs/:id/comments - Add comment (student only)
router.post(
  '/:id/comments',
  authenticate,
  requireStudent,
  [
    body('comment_content')
      .trim()
      .notEmpty()
      .withMessage('Comment content is required')
      .isLength({ max: 1000 })
      .withMessage('Comment must be 1000 characters or less')
  ],
  handleValidationErrors,
  createComment
);

// DELETE /api/comments/:commentId - Delete comment (owner only)
router.delete('/comments/:commentId', authenticate, requireStudent, deleteComment);

module.exports = router;
