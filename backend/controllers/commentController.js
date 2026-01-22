const Comment = require('../models/Comment');
const Blog = require('../models/Blog');

// Get all comments for a blog
const getCommentsByBlogId = async (req, res) => {
  try {
    const { id } = req.params;
    const blogId = parseInt(id);

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found.'
      });
    }

    const comments = await Comment.findByBlogId(blogId);

    res.json({
      success: true,
      comments,
      count: comments.length
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching comments.'
    });
  }
};

// Create a new comment
const createComment = async (req, res) => {
  try {
    const { id } = req.params;
    const blogId = parseInt(id);
    const userId = req.user.userId;
    const { comment_content } = req.body;

    if (!comment_content || comment_content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required.'
      });
    }

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found.'
      });
    }

    const comment = await Comment.create({
      blog_id: blogId,
      user_id: userId,
      comment_content: comment_content.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating comment.'
    });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const id = parseInt(commentId);
    const userId = req.user.userId;

    // Check if comment exists
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found.'
      });
    }

    // Check if user owns the comment
    const isOwner = await Comment.isOwner(id, userId);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this comment.'
      });
    }

    const deleted = await Comment.delete(id, userId);
    if (deleted) {
      res.json({
        success: true,
        message: 'Comment deleted successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to delete comment.'
      });
    }
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting comment.'
    });
  }
};

module.exports = {
  getCommentsByBlogId,
  createComment,
  deleteComment
};
