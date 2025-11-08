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

    // Create new user with email verification required for students
    const userData = {
      name,
      email,
      password,
      userType,
      phone
    };

    // For students: require email verification AND admin approval
    if (userType === 'student') {
      userData.vitapId = vitapId;
      userData.year = year;
      userData.branch = branch;
      userData.isEmailVerified = false;
      userData.isVerified = false;
      userData.verificationStatus = 'pending';
      
      // Generate email verification token
      const verificationToken = generateVerificationToken();
      userData.emailVerificationToken = verificationToken;
      userData.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    } else {
      // Public and business users: auto-approve
      userData.isEmailVerified = true;
      userData.isVerified = true;
      userData.verificationStatus = 'approved';
    }

    const user = new User(userData);
    await user.save();

    // Send verification email for students (COMMENTED OUT - Email verification will be added later)
    if (userType === 'student') {
      // TODO: Enable email verification later
      // try {
      //   await sendVerificationEmail(user.email, user.emailVerificationToken, user.userType, user.name);
      // } catch (emailError) {
      //   console.error('Failed to send verification email:', emailError);
      // }

      return res.status(201).json({
        message: 'Registration successful! Your account is pending admin approval. You will be notified once approved.',
        requiresEmailVerification: false,
        requiresAdminApproval: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          isEmailVerified: false,
          verificationStatus: 'pending'
        }
      });
    }

    // For non-student users, auto-login
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

    res.status(201).json({
      message: 'Registration successful! You are now logged in.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        isEmailVerified: user.isEmailVerified,
        verificationStatus: user.verificationStatus,
        profilePicture: user.profilePicture
      }
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

    // For students: check admin approval (email verification disabled for now)
    if (user.userType === 'student') {
      // TODO: Re-enable email verification later
      // if (!user.isEmailVerified) {
      //   return res.status(403).json({ 
      //     message: 'Please verify your email address before logging in. Check your inbox for the verification link.',
      //     requiresEmailVerification: true,
      //     email: user.email
      //   });
      // }
      
      if (!user.isVerified || user.verificationStatus !== 'approved') {
        return res.status(403).json({ 
          message: 'Your account is pending admin approval. You will receive an email once your account is approved.',
          requiresAdminApproval: true,
          verificationStatus: user.verificationStatus
        });
      }
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

    // For student users, keep verification pending for admin approval
    if (user.userType === 'student') {
      user.verificationStatus = 'pending';
      user.isVerified = false;
    } else {
      // For non-student users, mark as fully verified
      user.isVerified = true;
      user.verificationStatus = 'approved';
    }

    await user.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.name, user.userType);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    // Notify admin about new student verification (for students only)
    if (user.userType === 'student') {
      try {
        await sendAdminNotification({
          name: user.name,
          email: user.email,
          vitapId: user.vitapId,
          year: user.year,
          branch: user.branch
        });
      } catch (emailError) {
        console.error('Failed to send admin notification:', emailError);
      }
    }

    res.json({
      message: user.userType === 'student' 
        ? 'Email verified successfully! Your account is now pending admin approval. You will receive an email once approved.'
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