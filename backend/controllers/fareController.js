const Fare = require('../models/Fare');

// Submit a new fare
const submitFare = async (req, res) => {
  try {
    const userId = req.user.userId;
    const collegeId = req.user.collegeId;
    const {
      fromPlaceName,
      fromLat,
      fromLng,
      toPlaceName,
      toLat,
      toLng,
      fareAmount,
      vehicleType = 'auto',
      notes = ''
    } = req.body;

    if (!fromPlaceName || !toPlaceName) {
      return res.status(400).json({
        success: false,
        message: 'Origin and destination place names are required.'
      });
    }

    const parsedFare = parseInt(fareAmount, 10);
    if (isNaN(parsedFare) || parsedFare <= 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid positive fare amount is required.'
      });
    }

    const fareId = await Fare.create({
      userId,
      collegeId,
      fromPlaceName: fromPlaceName.trim(),
      fromLat: parseFloat(fromLat) || 0,
      fromLng: parseFloat(fromLng) || 0,
      toPlaceName: toPlaceName.trim(),
      toLat: parseFloat(toLat) || 0,
      toLng: parseFloat(toLng) || 0,
      fareAmount: parsedFare,
      vehicleType,
      notes: notes ? notes.trim().slice(0, 500) : null
    });

    res.status(201).json({
      success: true,
      message: 'Fare submitted successfully. Thank you for contributing!',
      fareId
    });
  } catch (error) {
    console.error('Submit fare error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting fare.'
    });
  }
};

// Get fares and aggregated stats for a route
const getFaresForRoute = async (req, res) => {
  try {
    const { from_lat, from_lng, to_lat, to_lng, from_name, to_name } = req.query;

    const fromLat = parseFloat(from_lat);
    const fromLng = parseFloat(from_lng);
    const toLat = parseFloat(to_lat);
    const toLng = parseFloat(to_lng);

    const filter = {
      fromLat: !isNaN(fromLat) ? fromLat : null,
      fromLng: !isNaN(fromLng) ? fromLng : null,
      toLat: !isNaN(toLat) ? toLat : null,
      toLng: !isNaN(toLng) ? toLng : null,
      fromName: from_name || null,
      toName: to_name || null
    };

    const [fares, stats] = await Promise.all([
      Fare.findForRoute(filter),
      Fare.getRouteStats(filter)
    ]);

    res.json({
      success: true,
      count: fares.length,
      fares,
      stats
    });
  } catch (error) {
    console.error('Get fares error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching fares.'
    });
  }
};

// Get fares submitted by current user
const getMyFares = async (req, res) => {
  try {
    const userId = req.user.userId;
    const fares = await Fare.findByUser(userId);

    res.json({
      success: true,
      fares
    });
  } catch (error) {
    console.error('Get my fares error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching your submitted fares.'
    });
  }
};

// Delete user's own fare
const deleteFare = async (req, res) => {
  try {
    const userId = req.user.userId;
    const fareId = parseInt(req.params.id, 10);

    const deleted = await Fare.deleteOwn(fareId, userId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Fare not found or you are not authorized to delete it.'
      });
    }

    res.json({
      success: true,
      message: 'Fare deleted successfully.'
    });
  } catch (error) {
    console.error('Delete fare error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting fare.'
    });
  }
};

// Get recent fares
const getRecentFares = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const fares = await Fare.getRecent(limit);

    res.json({
      success: true,
      fares
    });
  } catch (error) {
    console.error('Get recent fares error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recent fares.'
    });
  }
};

module.exports = {
  submitFare,
  getFaresForRoute,
  getMyFares,
  deleteFare,
  getRecentFares
};

