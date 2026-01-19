const Reaction = require('../models/Reaction');
const Blog = require('../models/Blog');

// Like a blog
const likeBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blogId = parseInt(id);
    const userId = req.user.userId;

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found.'
      });
    }

    // Check if user already liked
    const hasLiked = await Reaction.hasLiked(blogId, userId);
    if (hasLiked) {
      return res.status(400).json({
        success: false,
        message: 'You have already liked this blog.'
      });
    }

    // Add like
    const liked = await Reaction.like(blogId, userId);
    if (liked) {
      const likeCount = await Reaction.getLikeCount(blogId);
      res.json({
        success: true,
        message: 'Blog liked successfully',
        likeCount
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to like blog.'
      });
    }
  } catch (error) {
    console.error('Like blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while liking blog.'
    });
  }
};

// Unlike a blog (remove like)
const unlikeBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blogId = parseInt(id);
    const userId = req.user.userId;

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found.'
      });
    }

    // Remove like
    const unliked = await Reaction.unlike(blogId, userId);
    if (unliked) {
      const likeCount = await Reaction.getLikeCount(blogId);
      res.json({
        success: true,
        message: 'Like removed successfully',
        likeCount
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'You have not liked this blog.'
      });
    }
  } catch (error) {
    console.error('Unlike blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing like.'
    });
  }
};

// Get like status for a blog (check if current user liked it)
const getLikeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const blogId = parseInt(id);
    const userId = req.user.userId;

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found.'
      });
    }

    const hasLiked = await Reaction.hasLiked(blogId, userId);
    const likeCount = await Reaction.getLikeCount(blogId);

    res.json({
      success: true,
      hasLiked,
      likeCount
    });
  } catch (error) {
    console.error('Get like status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching like status.'
    });
  }
};

module.exports = {
  likeBlog,
  unlikeBlog,
  getLikeStatus
};
