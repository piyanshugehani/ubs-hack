import School  from '../models/School.js';
import Volunteer  from '../models/Volunteer.js';

// Helper function to send JWT in response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      role: user.role  // Include role in response
    });
};

// @desc    Register school
// @route   POST /api/v1/auth/schools/register
// @access  Public
export const registerSchool = async (req, res) => {
  try {
    const { name, email, password, location, description } = req.body;

    // Create school
    const school = await School.create({
      name,
      email,
      password,
      location,
      description
    });

    sendTokenResponse(school, 201, res);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Login school
// @route   POST /api/v1/auth/schools/login
// @access  Public
export const loginSchool = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    // Check for school
    const school = await School.findOne({ email }).select('+password');

    if (!school) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await school.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(school, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Register volunteer
// @route   POST /api/v1/auth/volunteers/register
// @access  Public
export const registerVolunteer = async (req, res) => {
  try {
    const { name, email, password, phone, skills, languages, locations, availability } = req.body;

    // Check if volunteer already exists
    const existingVolunteer = await Volunteer.findOne({ email });
    if (existingVolunteer) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    // Create new volunteer
    const volunteer = await Volunteer.create({
      name,
      email,
      password,
      phone,
      skills,
      languages,
      locations,
      availability
    });

    sendTokenResponse(volunteer, 201, res);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Login volunteer
// @route   POST /api/v1/auth/volunteers/login
// @access  Public
export const loginVolunteer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    // Check if volunteer exists
    const volunteer = await Volunteer.findOne({ email }).select('+password');
    if (!volunteer) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await volunteer.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(volunteer, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Logout user
// @route   GET /api/v1/auth/logout
// @access  Private
export const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
};