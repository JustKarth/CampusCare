const Blog = require('../models/Blog');
const { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } = require('../config/constants');

// Get all blogs with pagination
const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
    const collegeId = req.query.collegeId ? parseInt(req.query.collegeId) : null;

    const blogs = await Blog.findAll(collegeId, page, limit);

    res.json({
      success: true,
      blogs,
      pagination: {
        page,
        limit,
        total: blogs.length
      }
    });
  } catch (error) {
    console.error('Get all blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching blogs.'
    });
  }
};

// Get a single blog by ID
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blogId = parseInt(id);

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found.'
      });
    }

    // Get blog images
    const images = await Blog.getBlogImages(blogId);

    res.json({
      success: true,
      blog: {
        ...blog,
        images
      }
    });
  } catch (error) {
    console.error('Get blog by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching blog.'
    });
  }
};

// Create a new blog
const createBlog = async (req, res) => {
  try {
    const { blog_title, blog_content } = req.body;
    const userId = req.user.userId;
    const collegeId = req.user.collegeId;

    if (!blog_title || !blog_content) {
      return res.status(400).json({
        success: false,
        message: 'Blog title and content are required.'
      });
    }

    const blog = await Blog.create({
      user_id: userId,
      college_id: collegeId,
      blog_title,
      blog_content
    });

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating blog.'
    });
  }
};

// Update a blog
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blogId = parseInt(id);
    const userId = req.user.userId;
    const { blog_title, blog_content } = req.body;

    // Check if blog exists
    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found.'
      });
    }

    // Check if user owns the blog
    const isOwner = await Blog.isOwner(blogId, userId);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this blog.'
      });
    }

    const updatedBlog = await Blog.update(blogId, userId, {
      blog_title,
      blog_content
    });

    res.json({
      success: true,
      message: 'Blog updated successfully',
      blog: updatedBlog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating blog.'
    });
  }
};

// Delete a blog
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blogId = parseInt(id);
    const userId = req.user.userId;

    // Check if blog exists
    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found.'
      });
    }

    // Check if user owns the blog
    const isOwner = await Blog.isOwner(blogId, userId);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this blog.'
      });
    }

    const deleted = await Blog.delete(blogId, userId);
    if (deleted) {
      res.json({
        success: true,
        message: 'Blog deleted successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to delete blog.'
      });
    }
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting blog.'
    });
  }
};

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
};
