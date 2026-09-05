const pool = require('../config/database');

// 1. Get platform-wide statistics
const getAdminStats = async (req, res) => {
  try {
    const [[users]] = await pool.query('SELECT COUNT(*) as count FROM user_profiles');
    const [[blogs]] = await pool.query('SELECT COUNT(*) as count FROM blog');
    const [[reviews]] = await pool.query("SELECT COUNT(*) as count FROM place_rating WHERE review_text IS NOT NULL AND review_text != ''");
    const [[places]] = await pool.query('SELECT COUNT(*) as count FROM places');
    const [[fares]] = await pool.query('SELECT COUNT(*) as count FROM fares');
    const [[resources]] = await pool.query('SELECT COUNT(*) as count FROM academic_resources');
    const [[moderators]] = await pool.query('SELECT COUNT(*) as count FROM user_profiles WHERE is_moderator = 1');

    res.json({
      success: true,
      stats: {
        totalUsers: users.count || 0,
        totalBlogs: blogs.count || 0,
        totalReviews: reviews.count || 0,
        totalPlaces: places.count || 0,
        totalFares: fares.count || 0,
        totalResources: resources.count || 0,
        totalModerators: moderators.count || 0
      }
    });
  } catch (error) {
    console.error('Admin get stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch admin stats' });
  }
};

// 2. Get users list with optional search and filter
const getUsers = async (req, res) => {
  try {
    const { search = '', role = 'all', limit = 50 } = req.query;

    let query = `
      SELECT 
        u.user_id, u.email, u.reg_no, u.first_name, u.middle_name, u.last_name,
        u.is_moderator, u.is_admin, u.graduation_year, u.created_at,
        c.college_name,
        co.course_name
      FROM user_profiles u
      LEFT JOIN colleges c ON u.college_id = c.college_id
      LEFT JOIN courses co ON u.course_id = co.course_id
      WHERE 1=1
    `;
    const params = [];

    if (search.trim()) {
      query += ` AND (
        u.first_name LIKE ? OR 
        u.last_name LIKE ? OR 
        u.email LIKE ? OR 
        u.reg_no LIKE ?
      )`;
      const searchTerm = `%${search.trim()}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (role === 'admin') {
      query += ' AND u.is_admin = 1';
    } else if (role === 'moderator') {
      query += ' AND u.is_moderator = 1';
    } else if (role === 'student') {
      query += ' AND u.is_admin = 0 AND u.is_moderator = 0';
    }

    query += ' ORDER BY u.created_at DESC LIMIT ?';
    params.push(parseInt(limit, 10) || 50);

    const [users] = await pool.query(query, params);

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

// 3. Update user role (moderator / admin)
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const targetUserId = parseInt(id, 10);
    const { is_moderator, is_admin } = req.body;

    if (targetUserId === req.user.userId && is_admin === false) {
      return res.status(400).json({
        success: false,
        message: 'You cannot revoke your own administrator privileges.'
      });
    }

    const updates = [];
    const params = [];

    if (is_moderator !== undefined) {
      updates.push('is_moderator = ?');
      params.push(is_moderator ? 1 : 0);
    }
    if (is_admin !== undefined) {
      updates.push('is_admin = ?');
      params.push(is_admin ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No role updates specified' });
    }

    params.push(targetUserId);
    await pool.query(`UPDATE user_profiles SET ${updates.join(', ')} WHERE user_id = ?`, params);

    res.json({
      success: true,
      message: 'User roles updated successfully'
    });
  } catch (error) {
    console.error('Admin update user role error:', error);
    res.status(500).json({ success: false, message: 'Failed to update user role' });
  }
};

// 4. Delete user account
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const targetUserId = parseInt(id, 10);

    if (targetUserId === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account from the admin console.'
      });
    }

    await pool.query('DELETE FROM user_profiles WHERE user_id = ?', [targetUserId]);

    res.json({
      success: true,
      message: 'User account and associated records deleted successfully.'
    });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

// 5. Get blogs with author and comment metrics
const getBlogs = async (req, res) => {
  try {
    const [blogs] = await pool.query(`
      SELECT 
        b.blog_id, b.blog_title, b.blog_content, b.created_at,
        u.user_id, u.email as author_email, u.first_name, u.last_name,
        (SELECT COUNT(*) FROM blog_comments bc WHERE bc.blog_id = b.blog_id) as comment_count,
        (SELECT COUNT(*) FROM blog_likes bl WHERE bl.blog_id = b.blog_id) as like_count
      FROM blog b
      LEFT JOIN user_profiles u ON b.user_id = u.user_id
      ORDER BY b.created_at DESC
      LIMIT 100
    `);

    res.json({
      success: true,
      blogs
    });
  } catch (error) {
    console.error('Admin get blogs error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch blogs' });
  }
};

// 6. Delete blog post
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM blog WHERE blog_id = ?', [parseInt(id, 10)]);

    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Admin delete blog error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete blog post' });
  }
};

// 7. Get reviews for places
const getReviews = async (req, res) => {
  try {
    const [reviews] = await pool.query(`
      SELECT 
        pr.place_id, pr.user_id, pr.rating, pr.review_text, pr.created_at,
        p.place_name,
        u.first_name, u.last_name, u.email
      FROM place_rating pr
      JOIN places p ON pr.place_id = p.place_id
      LEFT JOIN user_profiles u ON pr.user_id = u.user_id
      WHERE pr.review_text IS NOT NULL AND pr.review_text != ''
      ORDER BY pr.created_at DESC
      LIMIT 100
    `);

    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('Admin get reviews error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
};

// 8. Delete specific review
const deleteReview = async (req, res) => {
  try {
    const { placeId, userId } = req.params;
    await pool.query(
      'DELETE FROM place_rating WHERE place_id = ? AND user_id = ?',
      [parseInt(placeId, 10), parseInt(userId, 10)]
    );

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Admin delete review error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
};

// 9. Get spots/places
const getPlaces = async (req, res) => {
  try {
    const [places] = await pool.query(`
      SELECT 
        p.place_id, p.place_name, p.address, p.distance, p.lat, p.lng, p.price_range, p.tags,
        c.category_name,
        u.email as submitted_by_email,
        (SELECT COUNT(*) FROM place_rating pr WHERE pr.place_id = p.place_id) as total_ratings,
        (SELECT AVG(rating) FROM place_rating pr WHERE pr.place_id = p.place_id) as average_rating
      FROM places p
      LEFT JOIN local_guide_categories c ON p.category_id = c.category_id
      LEFT JOIN user_profiles u ON p.submitted_by = u.user_id
      ORDER BY p.place_id DESC
    `);

    res.json({
      success: true,
      places
    });
  } catch (error) {
    console.error('Admin get places error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch places' });
  }
};

// 10. Delete spot/place
const deletePlace = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM places WHERE place_id = ?', [parseInt(id, 10)]);

    res.json({
      success: true,
      message: 'Spot removed from Local Guide'
    });
  } catch (error) {
    console.error('Admin delete place error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete spot' });
  }
};

// 11. Get community fares
const getFares = async (req, res) => {
  try {
    const [fares] = await pool.query(`
      SELECT 
        f.fare_id, f.from_place_name, f.to_place_name, f.fare_amount,
        f.vehicle_type, f.notes, f.submitted_at,
        u.email as submitter_email, u.first_name, u.last_name
      FROM fares f
      LEFT JOIN user_profiles u ON f.user_id = u.user_id
      ORDER BY f.submitted_at DESC
      LIMIT 100
    `);

    res.json({
      success: true,
      fares
    });
  } catch (error) {
    console.error('Admin get fares error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch fares' });
  }
};

// 12. Delete fare report
const deleteFare = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM fares WHERE fare_id = ?', [parseInt(id, 10)]);

    res.json({
      success: true,
      message: 'Fare record deleted successfully'
    });
  } catch (error) {
    console.error('Admin delete fare error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete fare' });
  }
};

// 13. Get academic resources
const getResources = async (req, res) => {
  try {
    const [resources] = await pool.query(`
      SELECT 
        r.resource_id, r.resource_title, r.resource_description, r.resource_link,
        c.college_name
      FROM academic_resources r
      LEFT JOIN colleges c ON r.college_id = c.college_id
      ORDER BY r.resource_id DESC
    `);

    res.json({
      success: true,
      resources
    });
  } catch (error) {
    console.error('Admin get resources error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch resources' });
  }
};

// 14. Delete academic resource
const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM academic_resources WHERE resource_id = ?', [parseInt(id, 10)]);

    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    console.error('Admin delete resource error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete resource' });
  }
};

module.exports = {
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
};
