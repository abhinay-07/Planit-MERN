const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Middleware to check if user is a verified student
const isVerifiedStudent = (req, res, next) => {
  if (req.user.userType !== 'student') {
    return res.status(403).json({ message: 'Access denied. Students only.' });
  }
  
  if (req.user.verificationStatus !== 'approved') {
    return res.status(403).json({ message: 'Access denied. Student verification required.' });
  }
  
  next();
};

// Middleware to check if user is verified (for any user type)
const isVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({ message: 'Access denied. Account verification required.' });
  }
  
  next();
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  
  next();
};

// Middleware to check if user is super admin
const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied. Super admin privileges required.' });
  }
  
  next();
};

// Combined auth and admin check
const adminAuth = [auth, isAdmin];
const superAdminAuth = [auth, isSuperAdmin];

module.exports = { 
  auth, 
  isVerifiedStudent, 
  isVerified, 
  isAdmin, 
  isSuperAdmin, 
  adminAuth, 
  superAdminAuth 
};