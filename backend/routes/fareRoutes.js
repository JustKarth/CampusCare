const express = require('express');
const { body } = require('express-validator');
const {
  submitFare,
  getFaresForRoute,
  getMyFares,
  deleteFare,
  getRecentFares
} = require('../controllers/fareController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validate');

const router = express.Router();

// GET /api/fares - Get fares and stats for a route (public/optionalAuth)
router.get('/', optionalAuth, getFaresForRoute);

// GET /api/fares/recent - Get latest community fares
router.get('/recent', optionalAuth, getRecentFares);

// GET /api/fares/mine - Get user's own submitted fares (auth required)
router.get('/mine', authenticate, getMyFares);

// POST /api/fares - Submit a new fare (auth required)
router.post(
  '/',
  authenticate,
  [
    body('fromPlaceName')
      .trim()
      .notEmpty()
      .withMessage('Origin place name is required')
      .isLength({ max: 255 }),
    body('toPlaceName')
      .trim()
      .notEmpty()
      .withMessage('Destination place name is required')
      .isLength({ max: 255 }),
    body('fareAmount')
      .isInt({ min: 1, max: 10000 })
      .withMessage('Fare must be between ₹1 and ₹10,000'),
    body('vehicleType')
      .optional()
      .isIn(['auto', 'cab', 'e-rickshaw', 'bus', 'other'])
      .withMessage('Invalid vehicle type'),
    body('notes')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Notes cannot exceed 500 characters')
  ],
  handleValidationErrors,
  submitFare
);

// DELETE /api/fares/:id - Delete own fare submission (auth required)
router.delete('/:id', authenticate, deleteFare);

module.exports = router;

