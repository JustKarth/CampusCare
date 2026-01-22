const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_EXPIRATION } = require('../config/constants');

// Register a new user
const register = async (req, res) => {
  try {
    const {
      email,
      password,
      reg_no,
      first_name,
      middle_name,
      last_name,
      college_id,
      course_id,
      graduation_year,
      date_of_birth,
      native_state_id,
      native_city
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.'
      });
    }

    // Validate college email domain (for students)
    const college = await User.findCollegeByEmailDomain(email);
    if (!college) {
      return res.status(400).json({
        success: false,
        message: 'Invalid college email domain. Please use your college email.'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      hashed_password: hashedPassword,
      reg_no,
      first_name,
      middle_name,
      last_name,
      college_id: college.college_id, // Use college_id from domain lookup
      course_id,
      graduation_year,
      date_of_birth,
      native_state_id,
      native_city
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    // Return user data (without password)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        userId: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        collegeId: user.college_id
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration.'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.hashed_password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    // Get user details
    const userDetails = await User.findByIdWithDetails(user.user_id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        userId: userDetails.user_id,
        email: userDetails.email,
        firstName: userDetails.first_name,
        lastName: userDetails.last_name,
        collegeId: userDetails.college_id,
        collegeName: userDetails.college_name,
        courseName: userDetails.course_name,
        isModerator: userDetails.is_moderator,
        isAdmin: userDetails.is_admin,
        avatarUrl: userDetails.avatar_url
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login.'
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const userDetails = await User.findByIdWithDetails(req.user.userId);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    res.json({
      success: true,
      user: {
        userId: userDetails.user_id,
        email: userDetails.email,
        regNo: userDetails.reg_no,
        firstName: userDetails.first_name,
        middleName: userDetails.middle_name,
        lastName: userDetails.last_name,
        collegeId: userDetails.college_id,
        collegeName: userDetails.college_name,
        courseId: userDetails.course_id,
        courseName: userDetails.course_name,
        graduationYear: userDetails.graduation_year,
        avatarId: userDetails.avatar_id,
        avatarUrl: userDetails.avatar_url,
        isModerator: userDetails.is_moderator,
        isAdmin: userDetails.is_admin,
        createdAt: userDetails.created_at
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile.'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile
};
