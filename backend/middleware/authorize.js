// Middleware to check if user is a student (not a guest)
const requireStudent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please login.'
    });
  }

  // Check if user has a college_id (students have college_id, guests might not)
  // For now, we assume all authenticated users are students
  // If you implement guest users differently, adjust this logic
  if (!req.user.collegeId) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Student account required.'
    });
  }

  next();
};

// Middleware to check if user is a moderator
const requireModerator = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please login.'
    });
  }

  if (!req.user.isModerator && !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Moderator privileges required.'
    });
  }

  next();
};

// Middleware to check if user is an admin
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please login.'
    });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }

  next();
};

// Middleware to check if user is moderator or admin
const requireModeratorOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please login.'
    });
  }

  if (!req.user.isModerator && !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Moderator or Admin privileges required.'
    });
  }

  next();
};

module.exports = {
  requireStudent,
  requireModerator,
  requireAdmin,
  requireModeratorOrAdmin
};
