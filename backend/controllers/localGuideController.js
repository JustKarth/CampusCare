const LocalGuide = require('../models/LocalGuide');

// Get all places for a college
const getPlaces = async (req, res) => {
  try {
    const collegeId = req.user ? req.user.collegeId : (req.query.collegeId || 1);
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId) : null;
    
    const places = await LocalGuide.findByCollegeId(parseInt(collegeId), categoryId);

    // Also attach recent reviews for each place
    const placesWithReviews = await Promise.all(
      places.map(async (place) => {
        const reviews = await LocalGuide.getReviews(place.place_id);
        return {
          ...place,
          reviews: reviews.slice(0, 3)
        };
      })
    );

    res.json({
      success: true,
      places: placesWithReviews,
      count: placesWithReviews.length
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
    const collegeId = req.user ? req.user.collegeId : (req.query.collegeId || 1);

    const places = await LocalGuide.findByCategory(parseInt(collegeId), category);

    const placesWithReviews = await Promise.all(
      places.map(async (place) => {
        const reviews = await LocalGuide.getReviews(place.place_id);
        return {
          ...place,
          reviews: reviews.slice(0, 3)
        };
      })
    );

    res.json({
      success: true,
      category,
      places: placesWithReviews,
      count: placesWithReviews.length
    });
  } catch (error) {
    console.error('Get places by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching places by category.'
    });
  }
};

// Get a single place by ID with its full reviews
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

    const reviews = await LocalGuide.getReviews(placeId);

    res.json({
      success: true,
      place: {
        ...place,
        reviews
      }
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

// Add or update rating + review for a place
const addRating = async (req, res) => {
  try {
    const { id } = req.params;
    const placeId = parseInt(id);
    const userId = req.user.userId;
    const { rating, reviewText, location } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5.'
      });
    }

    const place = await LocalGuide.findById(placeId);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found.'
      });
    }

    // Validate optional location coordinates if provided
    let locationData = null;
    if (location && location.lat && location.lng) {
      locationData = {
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lng),
        address: location.address ? location.address.trim() : null
      };
    }

    const updatedPlace = await LocalGuide.addRating(
      placeId,
      userId,
      rating,
      reviewText ? reviewText.trim() : null,
      locationData
    );

    const reviews = await LocalGuide.getReviews(placeId);

    res.json({
      success: true,
      message: 'Rating and review added successfully!',
      place: {
        ...updatedPlace,
        reviews
      }
    });
  } catch (error) {
    console.error('Add rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding rating.'
    });
  }
};

// Get user's rating and review for a place
const getUserRating = async (req, res) => {
  try {
    const { id } = req.params;
    const placeId = parseInt(id);
    const userId = req.user.userId;

    const rating = await LocalGuide.getUserRating(placeId, userId);

    res.json({
      success: true,
      rating: rating ? rating.rating : null,
      reviewText: rating ? rating.review_text : null
    });
  } catch (error) {
    console.error('Get user rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user rating.'
    });
  }
};

// Get all reviews for a place
const getPlaceReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const placeId = parseInt(id);

    const reviews = await LocalGuide.getReviews(placeId);

    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('Get place reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews.'
    });
  }
};

// Create a new place (by student)
const createPlace = async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    const userId = req.user.userId;
    const {
      categoryId,
      placeName,
      placeDescription,
      address,
      distance,
      lat,
      lng,
      priceRange,
      tags,
      website,
      phone,
      initialRating,
      initialReview
    } = req.body;

    if (!placeName || !placeDescription || !categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Place name, description, and category are required.'
      });
    }

    const createdPlace = await LocalGuide.create({
      category_id: parseInt(categoryId),
      college_id: collegeId,
      place_name: placeName.trim(),
      place_description: placeDescription.trim(),
      address: address ? address.trim() : null,
      distance: distance ? parseFloat(distance) : null,
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
      price_range: priceRange || '₹₹',
      tags: tags ? tags.trim() : null,
      website: website ? website.trim() : null,
      phone: phone ? phone.trim() : null,
      submitted_by: userId
    });

    // If user provided an initial rating/review:
    if (initialRating && initialRating >= 1 && initialRating <= 5) {
      await LocalGuide.addRating(
        createdPlace.place_id,
        userId,
        initialRating,
        initialReview ? initialReview.trim() : null
      );
    }

    res.status(201).json({
      success: true,
      message: 'Place added successfully! Thank you for contributing to the student guide.',
      place: createdPlace
    });
  } catch (error) {
    console.error('Create place error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'A place with this name already exists for your college.'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating place.'
    });
  }
};

module.exports = {
  getPlaces,
  getPlacesByCategory,
  getPlaceById,
  getCategories,
  addRating,
  getUserRating,
  getPlaceReviews,
  createPlace
};
