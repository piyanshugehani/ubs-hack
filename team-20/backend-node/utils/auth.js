import jwt from 'jsonwebtoken';
import School  from '../models/School.js';
import Volunteer  from '../models/Volunteer.js';

// Middleware to protect routes
export const protect = async (req, res, next) => {
  let token;
  
  // Check if auth header exists and starts with Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // If token exists in cookies
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is a school or volunteer
    if (decoded.role === 'school') {
      req.user = await School.findById(decoded.id);
    } else if (decoded.role === 'volunteer') {
      req.user = await Volunteer.findById(decoded.id);
    }
    
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

// Role-based authorization middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};