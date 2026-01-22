const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validate');

const router = express.Router();

// POST /api/auth/register
router.post(
  '/register',
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('reg_no')
      .notEmpty()
      .withMessage('Registration number is required'),
    body('first_name')
      .trim()
      .notEmpty()
      .withMessage('First name is required'),
    body('last_name')
      .trim()
      .notEmpty()
      .withMessage('Last name is required'),
    body('course_id')
      .isInt({ min: 1 })
      .withMessage('Valid course ID is required'),
    body('graduation_year')
      .isInt({ min: 2000, max: 2100 })
      .withMessage('Valid graduation year is required'),
    body('date_of_birth')
      .isISO8601()
      .withMessage('Valid date of birth is required (YYYY-MM-DD)')
  ],
  handleValidationErrors,
  register
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  handleValidationErrors,
  login
);

// GET /api/auth/profile
router.get('/profile', authenticate, getProfile);

module.exports = router;
