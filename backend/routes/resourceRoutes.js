const express = require('express');
const { body } = require('express-validator');
const {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource
} = require('../controllers/resourceController');
const { authenticate } = require('../middleware/auth');
const { requireStudent, requireModeratorOrAdmin } = require('../middleware/authorize');
const { handleValidationErrors } = require('../middleware/validate');

const router = express.Router();

// GET /api/resources - Get all resources (student only)
router.get('/', authenticate, requireStudent, getResources);

// GET /api/resources/:id - Get single resource (student only)
router.get('/:id', authenticate, requireStudent, getResourceById);

// POST /api/resources - Create resource (moderator/admin only)
router.post(
  '/',
  authenticate,
  requireModeratorOrAdmin,
  [
    body('resource_title')
      .trim()
      .notEmpty()
      .withMessage('Resource title is required'),
    body('resource_link')
      .isURL()
      .withMessage('Valid resource URL is required'),
    body('resource_description')
      .optional()
      .trim()
  ],
  handleValidationErrors,
  createResource
);

// PUT /api/resources/:id - Update resource (moderator/admin only)
router.put(
  '/:id',
  authenticate,
  requireModeratorOrAdmin,
  [
    body('resource_title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Resource title cannot be empty'),
    body('resource_link')
      .optional()
      .isURL()
      .withMessage('Valid resource URL is required'),
    body('resource_description')
      .optional()
      .trim()
  ],
  handleValidationErrors,
  updateResource
);

// DELETE /api/resources/:id - Delete resource (moderator/admin only)
router.delete('/:id', authenticate, requireModeratorOrAdmin, deleteResource);

module.exports = router;
