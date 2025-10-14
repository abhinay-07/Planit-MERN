const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { 
  generateVerificationToken, 
  sendVerificationEmail, 
  sendWelcomeEmail, 
  sendAdminNotification 
} = require('../utils/emailService');

const router = express.Router();

// Register
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('userType').isIn(['student', 'public', 'business']).withMessage('Invalid user type'),
  body('vitapId').optional().custom((value, { req }) => {
    if (req.body.userType === 'student' && !value) {
      throw new Error('VIT-AP ID is required for students');
    }
    return true;
  }),
  body('year').optional().isIn(['1', '2', '3', '4']).withMessage('Invalid year'),
  body('branch').optional().isLength({ min: 1 }).withMessage('Branch is required for students')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, userType, vitapId, year, branch, phone } = req.body;

    // VIT-AP email validation for students
    if (userType === 'student' && !email.toLowerCase().endsWith('@vitapstudent.ac.in')) {
      return res.status(400).json({ 
        message: 'Students must register with their VIT-AP email address (@vitapstudent.ac.in)' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Check if VIT-AP ID is already registered (for students)
    if (userType === 'student' && vitapId) {
      const existingVitapUser = await User.findOne({ vitapId });
      if (existingVitapUser) {
        return res.status(400).json({ message: 'VIT-AP ID already registered' });
      }
    }

    // Generate email verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user
    const userData = {
      name,
      email,
      password,
      userType,
      phone,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires
    };

    if (userType === 'student') {
      userData.vitapId = vitapId;
      userData.year = year;
      userData.branch = branch;
    }

    const user = new User(userData);
    await user.save();

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationToken, userType, name);
    
    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      // Don't fail registration if email fails, but log it
    }

    // Send admin notification for student registrations
    if (userType === 'student') {
      await sendAdminNotification({
        name,
        email,
        vitapId,
        year,
        branch
      });
    }

    res.status(201).json({
      message: userType === 'student' 
        ? 'Registration successful! Please check your VIT-AP email for verification instructions.'
        : 'Registration successful! Please check your email for verification instructions.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        isEmailVerified: user.isEmailVerified,
        verificationStatus: user.verificationStatus
      },
      requiresEmailVerification: true
    });

  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check email verification
    if (!user.isEmailVerified) {
      return res.status(401).json({ 
        message: 'Please verify your email address before logging in',
        requiresEmailVerification: true,
        userEmail: user.email
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        userType: user.userType,
        isVerified: user.isVerified,
        isEmailVerified: user.isEmailVerified
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        isEmailVerified: user.isEmailVerified,
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus,
        profilePicture: user.profilePicture
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Verify email
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    // For non-student users, mark as fully verified
    if (user.userType !== 'student' && user.userType !== 'business') {
      user.isVerified = true;
      user.verificationStatus = 'approved';
    }

    await user.save();

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name, user.userType);

    res.json({
      message: user.userType === 'student' 
        ? 'Email verified successfully! Your account is now pending admin approval for student privileges.'
        : 'Email verified successfully! Your account is now active.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        isEmailVerified: user.isEmailVerified,
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error during email verification' });
  }
});

// Resend verification email
router.post('/resend-verification', [
  body('email').isEmail().withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationToken, user.userType, user.name);
    
    if (!emailResult.success) {
      return res.status(500).json({ message: 'Failed to send verification email' });
    }

    res.json({ message: 'Verification email sent successfully' });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password -emailVerificationToken');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({ user });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;