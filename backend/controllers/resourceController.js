const Resource = require('../models/Resource');
const { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } = require('../config/constants');

// Get all resources for a college
const getResources = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
    const collegeId = req.user.collegeId;

    const resources = await Resource.findByCollegeId(collegeId, page, limit);

    res.json({
      success: true,
      resources,
      pagination: {
        page,
        limit,
        total: resources.length
      }
    });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching resources.'
    });
  }
};

// Get a single resource by ID
const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const resourceId = parseInt(id);
    const collegeId = req.user.collegeId;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.'
      });
    }

    // Check if resource belongs to user's college
    if (resource.college_id !== collegeId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this resource.'
      });
    }

    res.json({
      success: true,
      resource
    });
  } catch (error) {
    console.error('Get resource by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching resource.'
    });
  }
};

// Create a new resource (admin/moderator only)
const createResource = async (req, res) => {
  try {
    const { resource_title, resource_description, resource_link } = req.body;
    const collegeId = req.user.collegeId;

    if (!resource_title || !resource_link) {
      return res.status(400).json({
        success: false,
        message: 'Resource title and link are required.'
      });
    }

    const resource = await Resource.create({
      college_id: collegeId,
      resource_title,
      resource_description,
      resource_link
    });

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      resource
    });
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating resource.'
    });
  }
};

// Update a resource (admin/moderator only)
const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resourceId = parseInt(id);
    const collegeId = req.user.collegeId;
    const { resource_title, resource_description, resource_link } = req.body;

    // Check if resource exists
    const existingResource = await Resource.findById(resourceId);
    if (!existingResource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.'
      });
    }

    // Check if resource belongs to user's college
    if (existingResource.college_id !== collegeId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this resource.'
      });
    }

    const updatedResource = await Resource.update(resourceId, {
      resource_title,
      resource_description,
      resource_link
    });

    res.json({
      success: true,
      message: 'Resource updated successfully',
      resource: updatedResource
    });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating resource.'
    });
  }
};

// Delete a resource (admin/moderator only)
const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resourceId = parseInt(id);
    const collegeId = req.user.collegeId;

    // Check if resource exists
    const existingResource = await Resource.findById(resourceId);
    if (!existingResource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.'
      });
    }

    // Check if resource belongs to user's college
    if (existingResource.college_id !== collegeId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this resource.'
      });
    }

    const deleted = await Resource.delete(resourceId);
    if (deleted) {
      res.json({
        success: true,
        message: 'Resource deleted successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to delete resource.'
      });
    }
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting resource.'
    });
  }
};

module.exports = {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource
};
