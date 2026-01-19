const LocalGuide = require('../models/LocalGuide');

// Get all places for a college
const getPlaces = async (req, res) => {
  try {
    const collegeId = req.user ? req.user.collegeId : req.query.collegeId;
    
    if (!collegeId) {
      return res.status(400).json({
        success: false,
        message: 'College ID is required.'
      });
    }

    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId) : null;
    const places = await LocalGuide.findByCollegeId(parseInt(collegeId), categoryId);

    res.json({
      success: true,
      places,
      count: places.length
    });
  } catch (error) {
    console.error('Get places error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching places.'
    });
  }
};

// Get places by category name
const getPlacesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const collegeId = req.user ? req.user.collegeId : req.query.collegeId;

    if (!collegeId) {
      return res.status(400).json({
        success: false,
        message: 'College ID is required.'
      });
    }

    const places = await LocalGuide.findByCategory(parseInt(collegeId), category);

    res.json({
      success: true,
      category,
      places,
      count: places.length
    });
  } catch (error) {
    console.error('Get places by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching places by category.'
    });
  }
};

// Get a single place by ID
const getPlaceById = async (req, res) => {
  try {
    const { id } = req.params;
    const placeId = parseInt(id);

    const place = await LocalGuide.findById(placeId);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found.'
      });
    }

    res.json({
      success: true,
      place
    });
  } catch (error) {
    console.error('Get place by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching place.'
    });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await LocalGuide.getCategories();

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories.'
    });
  }
};

// Add or update rating for a place
const addRating = async (req, res) => {
  try {
    const { id } = req.params;
    const placeId = parseInt(id);
    const userId = req.user.userId;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5.'
      });
    }

    // Check if place exists
    const place = await LocalGuide.findById(placeId);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found.'
      });
    }

    const updatedPlace = await LocalGuide.addRating(placeId, userId, rating);

    res.json({
      success: true,
      message: 'Rating added successfully',
      place: updatedPlace
    });
  } catch (error) {
    console.error('Add rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding rating.'
    });
  }
};

// Get user's rating for a place
const getUserRating = async (req, res) => {
  try {
    const { id } = req.params;
    const placeId = parseInt(id);
    const userId = req.user.userId;

    const rating = await LocalGuide.getUserRating(placeId, userId);

    res.json({
      success: true,
      rating: rating ? rating.rating : null
    });
  } catch (error) {
    console.error('Get user rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user rating.'
    });
  }
};

module.exports = {
  getPlaces,
  getPlacesByCategory,
  getPlaceById,
  getCategories,
  addRating,
  getUserRating
};
