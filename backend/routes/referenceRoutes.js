const express = require('express');
const { getCourses, getStates, getAvatars } = require('../controllers/referenceController');

const router = express.Router();

// GET /api/courses - Public dropdown data for registration
router.get('/courses', getCourses);

// GET /api/states - Public dropdown data for registration
router.get('/states', getStates);

// GET /api/avatars - Public list of available avatars
router.get('/avatars', getAvatars);

module.exports = router;
