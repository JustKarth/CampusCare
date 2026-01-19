const express = require('express');
const { body } = require('express-validator');
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { requireStudent } = require('../middleware/authorize');
const { handleValidationErrors } = require('../middleware/validate');

const router = express.Router();

// GET /api/blogs - Get all blogs (public, optional auth)
router.get('/', optionalAuth, getAllBlogs);

// GET /api/blogs/:id - Get single blog (public, optional auth)
router.get('/:id', optionalAuth, getBlogById);

// POST /api/blogs - Create blog (student only)
router.post(
  '/',
  authenticate,
  requireStudent,
  [
    body('blog_title')
      .trim()
      .notEmpty()
      .withMessage('Blog title is required')
      .isLength({ max: 128 })
      .withMessage('Blog title must be 128 characters or less'),
    body('blog_content')
      .trim()
      .notEmpty()
      .withMessage('Blog content is required')
  ],
  handleValidationErrors,
  createBlog
);

// PUT /api/blogs/:id - Update blog (owner only)
router.put(
  '/:id',
  authenticate,
  requireStudent,
  [
    body('blog_title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Blog title cannot be empty')
      .isLength({ max: 128 })
      .withMessage('Blog title must be 128 characters or less'),
    body('blog_content')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Blog content cannot be empty')
  ],
  handleValidationErrors,
  updateBlog
);

// DELETE /api/blogs/:id - Delete blog (owner only)
router.delete('/:id', authenticate, requireStudent, deleteBlog);

module.exports = router;
