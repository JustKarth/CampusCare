const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin, requireModeratorOrAdmin } = require('../middleware/auth');
const {
  getAdminStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getBlogs,
  deleteBlog,
  getReviews,
  deleteReview,
  getPlaces,
  deletePlace,
  getFares,
  deleteFare,
  getResources,
  deleteResource
} = require('../controllers/adminController');

// All admin routes require authentication and admin/moderator role
router.use(authenticate);

// Platform stats
router.get('/stats', requireModeratorOrAdmin, getAdminStats);

// Users management (Strictly Admin only)
router.get('/users', requireAdmin, getUsers);
router.put('/users/:id/role', requireAdmin, updateUserRole);
router.delete('/users/:id', requireAdmin, deleteUser);

// Blogs moderation
router.get('/blogs', requireModeratorOrAdmin, getBlogs);
router.delete('/blogs/:id', requireModeratorOrAdmin, deleteBlog);

// Local Guide & Reviews moderation
router.get('/reviews', requireModeratorOrAdmin, getReviews);
router.delete('/reviews/:placeId/:userId', requireModeratorOrAdmin, deleteReview);
router.get('/places', requireModeratorOrAdmin, getPlaces);
router.delete('/places/:id', requireModeratorOrAdmin, deletePlace);

// Fares moderation
router.get('/fares', requireModeratorOrAdmin, getFares);
router.delete('/fares/:id', requireModeratorOrAdmin, deleteFare);

// Academic Resources moderation
router.get('/resources', requireModeratorOrAdmin, getResources);
router.delete('/resources/:id', requireModeratorOrAdmin, deleteResource);

module.exports = router;
