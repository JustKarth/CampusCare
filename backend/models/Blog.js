const pool = require('../config/database');

class Blog {
  // Get all blogs with pagination
  static async findAll(collegeId = null, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        b.blog_id, b.blog_title, b.blog_content, b.created_at,
        u.user_id, u.first_name, u.last_name, u.avatar_id,
        a.avatar_url,
        COUNT(DISTINCT bl.user_id) as like_count,
        COUNT(DISTINCT bc.comment_id) as comment_count
      FROM blog b
      INNER JOIN user_profiles u ON b.user_id = u.user_id
      LEFT JOIN avatars a ON u.avatar_id = a.avatar_id
      LEFT JOIN blog_likes bl ON b.blog_id = bl.blog_id
      LEFT JOIN blog_comments bc ON b.blog_id = bc.blog_id
    `;

    const params = [];

    if (collegeId) {
      query += ' WHERE b.college_id = ?';
      params.push(collegeId);
    }

    query += `
      GROUP BY b.blog_id, b.blog_title, b.blog_content, b.created_at,
               u.user_id, u.first_name, u.last_name, u.avatar_id, a.avatar_url
      ORDER BY b.created_at DESC
      LIMIT ? OFFSET ?
    `;

    params.push(limit, offset);

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  // Get a single blog by ID with full details
  static async findById(blogId) {
    const [rows] = await pool.execute(
      `SELECT 
        b.blog_id, b.blog_title, b.blog_content, b.created_at, b.college_id,
        u.user_id, u.first_name, u.last_name, u.email, u.avatar_id,
        a.avatar_url,
        COUNT(DISTINCT bl.user_id) as like_count
      FROM blog b
      INNER JOIN user_profiles u ON b.user_id = u.user_id
      LEFT JOIN avatars a ON u.avatar_id = a.avatar_id
      LEFT JOIN blog_likes bl ON b.blog_id = bl.blog_id
      WHERE b.blog_id = ?
      GROUP BY b.blog_id, b.blog_title, b.blog_content, b.created_at, b.college_id,
               u.user_id, u.first_name, u.last_name, u.email, u.avatar_id, a.avatar_url`,
      [blogId]
    );
    return rows[0] || null;
  }

  // Get blog images
  static async getBlogImages(blogId) {
    const [rows] = await pool.execute(
      `SELECT 
        bsi.image_index, bi.blog_image_id, bi.blog_image_url
      FROM blog_specific_images bsi
      INNER JOIN blog_images bi ON bsi.blog_image_id = bi.blog_image_id
      WHERE bsi.blog_id = ?
      ORDER BY bsi.image_index ASC`,
      [blogId]
    );
    return rows;
  }

  // Create a new blog
  static async create(blogData) {
    const { user_id, college_id, blog_title, blog_content } = blogData;

    const [result] = await pool.execute(
      'INSERT INTO blog (user_id, college_id, blog_title, blog_content) VALUES (?, ?, ?, ?)',
      [user_id, college_id, blog_title, blog_content]
    );

    return this.findById(result.insertId);
  }

  // Update a blog
  static async update(blogId, userId, updateData) {
    const { blog_title, blog_content } = updateData;

    const [result] = await pool.execute(
      'UPDATE blog SET blog_title = ?, blog_content = ? WHERE blog_id = ? AND user_id = ?',
      [blog_title, blog_content, blogId, userId]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return this.findById(blogId);
  }

  // Delete a blog
  static async delete(blogId, userId) {
    const [result] = await pool.execute(
      'DELETE FROM blog WHERE blog_id = ? AND user_id = ?',
      [blogId, userId]
    );
    return result.affectedRows > 0;
  }

  // Check if user owns the blog
  static async isOwner(blogId, userId) {
    const [rows] = await pool.execute(
      'SELECT blog_id FROM blog WHERE blog_id = ? AND user_id = ?',
      [blogId, userId]
    );
    return rows.length > 0;
  }

  // Add image to blog
  static async addImage(blogId, blogImageId, imageIndex) {
    await pool.execute(
      'INSERT INTO blog_specific_images (blog_id, blog_image_id, image_index) VALUES (?, ?, ?)',
      [blogId, blogImageId, imageIndex]
    );
  }
}

module.exports = Blog;
