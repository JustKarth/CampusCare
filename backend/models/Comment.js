const pool = require('../config/database');

class Comment {
  // Get all comments for a blog
  static async findByBlogId(blogId) {
    const [rows] = await pool.execute(
      `SELECT 
        bc.comment_id, bc.comment_content, bc.created_at,
        u.user_id, u.first_name, u.last_name, u.avatar_id,
        a.avatar_url
      FROM blog_comments bc
      INNER JOIN user_profiles u ON bc.user_id = u.user_id
      LEFT JOIN avatars a ON u.avatar_id = a.avatar_id
      WHERE bc.blog_id = ?
      ORDER BY bc.created_at ASC`,
      [blogId]
    );
    return rows;
  }

  // Get a single comment by ID
  static async findById(commentId) {
    const [rows] = await pool.execute(
      `SELECT 
        bc.comment_id, bc.blog_id, bc.comment_content, bc.created_at,
        u.user_id, u.first_name, u.last_name, u.avatar_id
      FROM blog_comments bc
      INNER JOIN user_profiles u ON bc.user_id = u.user_id
      WHERE bc.comment_id = ?`,
      [commentId]
    );
    return rows[0] || null;
  }

  // Create a new comment
  static async create(commentData) {
    const { blog_id, user_id, comment_content } = commentData;

    const [result] = await pool.execute(
      'INSERT INTO blog_comments (blog_id, user_id, comment_content) VALUES (?, ?, ?)',
      [blog_id, user_id, comment_content]
    );

    return this.findById(result.insertId);
  }

  // Delete a comment
  static async delete(commentId, userId) {
    const [result] = await pool.execute(
      'DELETE FROM blog_comments WHERE comment_id = ? AND user_id = ?',
      [commentId, userId]
    );
    return result.affectedRows > 0;
  }

  // Check if user owns the comment
  static async isOwner(commentId, userId) {
    const [rows] = await pool.execute(
      'SELECT comment_id FROM blog_comments WHERE comment_id = ? AND user_id = ?',
      [commentId, userId]
    );
    return rows.length > 0;
  }
}

module.exports = Comment;
