const express = require('express');
const { body } = require('express-validator');
const {
  getPlaces,
  getPlacesByCategory,
  getPlaceById,
  getCategories,
  addRating,
  getUserRating
} = require('../controllers/localGuideController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { requireStudent } = require('../middleware/authorize');
const { handleValidationErrors } = require('../middleware/validate');

const router = express.Router();

// GET /api/local-guide/categories - Get all categories (public)
router.get('/categories', getCategories);

// GET /api/local-guide/places - Get all places (public, collegeId in query)
router.get('/places', optionalAuth, getPlaces);

// GET /api/local-guide/places/:category - Get places by category (public)
router.get('/places/:category', optionalAuth, getPlacesByCategory);

// GET /api/local-guide/places/id/:id - Get single place (public)
router.get('/places/id/:id', optionalAuth, getPlaceById);

// POST /api/local-guide/places/:id/rating - Add/update rating (student only)
router.post(
  '/places/:id/rating',
  authenticate,
  requireStudent,
  [
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5')
  ],
  handleValidationErrors,
  addRating
);

// GET /api/local-guide/places/:id/rating - Get user's rating (student only)
router.get('/places/:id/rating', authenticate, requireStudent, getUserRating);

module.exports = router;
