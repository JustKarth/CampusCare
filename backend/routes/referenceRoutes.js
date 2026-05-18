const express = require('express');
const { getCourses, getStates } = require('../controllers/referenceController');

const router = express.Router();

// GET /api/courses - Public dropdown data for registration
router.get('/courses', getCourses);

// GET /api/states - Public dropdown data for registration
router.get('/states', getStates);

module.exports = router;
