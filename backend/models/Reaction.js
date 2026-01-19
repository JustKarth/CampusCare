const pool = require('../config/database');

class Reaction {
  // Check if user has liked a blog
  static async hasLiked(blogId, userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM blog_likes WHERE blog_id = ? AND user_id = ?',
      [blogId, userId]
    );
    return rows.length > 0;
  }

  // Like a blog
  static async like(blogId, userId) {
    try {
      await pool.execute(
        'INSERT INTO blog_likes (blog_id, user_id) VALUES (?, ?)',
        [blogId, userId]
      );
      return true;
    } catch (error) {
      // If duplicate entry, user already liked
      if (error.code === 'ER_DUP_ENTRY') {
        return false;
      }
      throw error;
    }
  }

  // Unlike a blog (remove like)
  static async unlike(blogId, userId) {
    const [result] = await pool.execute(
      'DELETE FROM blog_likes WHERE blog_id = ? AND user_id = ?',
      [blogId, userId]
    );
    return result.affectedRows > 0;
  }

  // Get like count for a blog
  static async getLikeCount(blogId) {
    const [rows] = await pool.execute(
      'SELECT COUNT(*) as count FROM blog_likes WHERE blog_id = ?',
      [blogId]
    );
    return rows[0].count;
  }

  // Get users who liked a blog
  static async getLikedBy(blogId) {
    const [rows] = await pool.execute(
      `SELECT 
        u.user_id, u.first_name, u.last_name, u.avatar_id,
        a.avatar_url
      FROM blog_likes bl
      INNER JOIN user_profiles u ON bl.user_id = u.user_id
      LEFT JOIN avatars a ON u.avatar_id = a.avatar_id
      WHERE bl.blog_id = ?`,
      [blogId]
    );
    return rows;
  }
}

module.exports = Reaction;
