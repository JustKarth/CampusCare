const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
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

    // Validate required fields
    if (!email || !password || !reg_no || !first_name || !last_name || !course_id || !graduation_year || !date_of_birth) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields.'
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanRegNo = String(reg_no).trim();

    // Check if user already exists with this email
    const existingUser = await User.findByEmail(cleanEmail);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.'
      });
    }

    // Validate college email domain (for students)
    const college = await User.findCollegeByEmailDomain(cleanEmail);
    if (!college) {
      return res.status(400).json({
        success: false,
        message: 'Invalid college email domain. Please use your official college email.'
      });
    }

    // Check if reg_no already exists for this college
    const [existingReg] = await pool.execute(
      'SELECT user_id FROM user_profiles WHERE reg_no = ? AND college_id = ?',
      [cleanRegNo, college.college_id]
    );
    if (existingReg.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'A student with this registration number is already registered.'
      });
    }

    // Validate course_id belongs to this college
    const parsedCourseId = parseInt(course_id, 10);
    const [courseCheck] = await pool.execute(
      'SELECT course_id FROM courses WHERE course_id = ? AND college_id = ?',
      [parsedCourseId, college.college_id]
    );
    if (courseCheck.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid course for your college.'
      });
    }

    // Sanitize native_state_id if provided
    let parsedStateId = null;
    if (native_state_id !== undefined && native_state_id !== null && String(native_state_id).trim() !== '') {
      const stateNum = parseInt(native_state_id, 10);
      if (!isNaN(stateNum)) {
        const [stateCheck] = await pool.execute('SELECT state_id FROM states WHERE state_id = ?', [stateNum]);
        if (stateCheck.length > 0) {
          parsedStateId = stateNum;
        }
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email: cleanEmail,
      hashed_password: hashedPassword,
      reg_no: cleanRegNo,
      first_name: String(first_name).trim(),
      middle_name: middle_name ? String(middle_name).trim() : null,
      last_name: String(last_name).trim(),
      college_id: college.college_id,
      course_id: parsedCourseId,
      graduation_year: parseInt(graduation_year, 10),
      date_of_birth,
      native_state_id: parsedStateId,
      native_city: native_city ? String(native_city).trim() : null
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

    if (error.code === 'ER_DUP_ENTRY') {
      const msg = error.sqlMessage || error.message || '';
      if (msg.includes('reg_no')) {
        return res.status(400).json({
          success: false,
          message: 'A student with this registration number is already registered.'
        });
      }
      if (msg.includes('email')) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists.'
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Duplicate entry detected.'
      });
    }

    if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_NO_REFERENCED_ROW') {
      return res.status(400).json({
        success: false,
        message: 'Invalid course, college, or state selected.'
      });
    }

    if (error.code === 'ER_TRUNCATED_WRONG_VALUE' || error.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format provided for one or more fields.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again later.'
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

// Update current user's avatar
const updateAvatar = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { avatar_id, avatar } = req.body;

    let targetAvatarId = avatar_id ? parseInt(avatar_id, 10) : null;

    // If client provided filename or path (e.g. 'Dragon.jpeg' or '/avatars/Dragon.jpeg')
    if (!targetAvatarId && avatar) {
      const cleanName = String(avatar).replace(/^\/?avatars\//, '');
      const [rows] = await pool.execute(
        'SELECT avatar_id FROM avatars WHERE avatar_url LIKE ? LIMIT 1',
        [`%${cleanName}%`]
      );
      if (rows.length > 0) {
        targetAvatarId = rows[0].avatar_id;
      }
    }

    if (!targetAvatarId) {
      return res.status(400).json({
        success: false,
        message: 'Valid avatar ID or name is required.'
      });
    }

    await User.update(userId, { avatar_id: targetAvatarId });
    const userDetails = await User.findByIdWithDetails(userId);

    res.json({
      success: true,
      message: 'Avatar updated successfully',
      avatarId: userDetails.avatar_id,
      avatarUrl: userDetails.avatar_url,
      user: {
        userId: userDetails.user_id,
        email: userDetails.email,
        firstName: userDetails.first_name,
        lastName: userDetails.last_name,
        collegeId: userDetails.college_id,
        collegeName: userDetails.college_name,
        courseId: userDetails.course_id,
        courseName: userDetails.course_name,
        graduationYear: userDetails.graduation_year,
        avatarId: userDetails.avatar_id,
        avatarUrl: userDetails.avatar_url
      }
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating avatar.'
    });
  }
};

// Update current user profile (Personal & Academic info)
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      first_name,
      middle_name,
      last_name,
      graduation_year,
      course_id,
      reg_no,
      native_state_id,
      native_city,
      date_of_birth
    } = req.body;

    const updateData = {};
    if (first_name !== undefined) updateData.first_name = first_name.trim();
    if (middle_name !== undefined) updateData.middle_name = middle_name ? middle_name.trim() : null;
    if (last_name !== undefined) updateData.last_name = last_name.trim();
    if (graduation_year !== undefined) updateData.graduation_year = parseInt(graduation_year, 10);
    if (course_id !== undefined) updateData.course_id = parseInt(course_id, 10);
    if (reg_no !== undefined) updateData.reg_no = reg_no ? reg_no.trim() : null;
    if (native_state_id !== undefined) updateData.native_state_id = native_state_id ? parseInt(native_state_id, 10) : null;
    if (native_city !== undefined) updateData.native_city = native_city ? native_city.trim() : null;
    if (date_of_birth !== undefined) updateData.date_of_birth = date_of_birth;

    await User.update(userId, updateData);
    const userDetails = await User.findByIdWithDetails(userId);

    res.json({
      success: true,
      message: 'Profile updated successfully',
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
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile.'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateAvatar,
  updateProfile
};

