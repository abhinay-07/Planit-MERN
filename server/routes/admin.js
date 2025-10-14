const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Place = require('../models/Place');
const Vehicle = require('../models/Vehicle');
const Review = require('../models/Review');
const { auth, adminAuth } = require('../middleware/auth');

// Admin middleware
const checkAdminRole = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};

// GET /api/admin/dashboard - Get dashboard statistics
router.get('/dashboard', auth, checkAdminRole, async (req, res) => {
  try {
    const stats = await Promise.all([
      User.countDocuments({ userType: 'student' }),
      User.countDocuments({ userType: 'student', verificationStatus: 'pending' }),
      User.countDocuments({ userType: 'business', verificationStatus: 'approved' }),
      User.countDocuments({ userType: 'business', verificationStatus: 'pending' }),
      Place.countDocuments(),
      Vehicle.countDocuments(),
      Review.countDocuments()
    ]);

    const dashboardStats = {
      totalStudents: stats[0],
      pendingStudents: stats[1],
      totalBusinesses: stats[2],
      pendingBusinesses: stats[3],
      totalPlaces: stats[4],
      totalVehicles: stats[5],
      totalReviews: stats[6]
    };

    res.json(dashboardStats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/students - Get all students with pagination and filtering
router.get('/students', auth, checkAdminRole, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search;

    let query = { userType: 'student' };
    
    if (status && status !== 'all') {
      query.verificationStatus = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { vitapId: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await User.find(query)
      .select('-password -emailVerificationToken')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      students,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalStudents: total
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/students/:id/verify - Approve/Reject student verification
router.put('/students/:id/verify', auth, checkAdminRole, async (req, res) => {
  try {
    const { status, reason } = req.body; // status: 'approved' or 'rejected'
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const student = await User.findById(req.params.id);
    if (!student || student.userType !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.verificationStatus = status;
    student.isVerified = status === 'approved';
    
    if (status === 'rejected' && reason) {
      student.rejectionReason = reason;
    }

    await student.save();

    // TODO: Send email notification to student
    // const emailService = require('../utils/emailService');
    // if (status === 'approved') {
    //   await emailService.sendApprovalEmail(student.email, student.name);
    // } else {
    //   await emailService.sendRejectionEmail(student.email, student.name, reason);
    // }

    res.json({ 
      message: `Student ${status} successfully`,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        verificationStatus: student.verificationStatus
      }
    });
  } catch (error) {
    console.error('Student verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/businesses - Get all businesses
router.get('/businesses', auth, checkAdminRole, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    let query = { userType: 'business' };
    
    if (status && status !== 'all') {
      query.verificationStatus = status;
    }

    const businesses = await User.find(query)
      .select('-password -emailVerificationToken')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    // Get additional business info (places count, etc.)
    const businessesWithStats = await Promise.all(
      businesses.map(async (business) => {
        const placesCount = await Place.countDocuments({ owner: business._id });
        const vehiclesCount = await Vehicle.countDocuments({ owner: business._id });
        
        return {
          ...business.toObject(),
          stats: {
            placesCount,
            vehiclesCount
          }
        };
      })
    );

    res.json({
      businesses: businessesWithStats,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBusinesses: total
    });
  } catch (error) {
    console.error('Get businesses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/businesses/:id/verify - Approve/Reject business verification
router.put('/businesses/:id/verify', auth, checkAdminRole, async (req, res) => {
  try {
    const { status, reason } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const business = await User.findById(req.params.id);
    if (!business || business.userType !== 'business') {
      return res.status(404).json({ message: 'Business not found' });
    }

    business.verificationStatus = status;
    business.isVerified = status === 'approved';
    
    if (status === 'rejected' && reason) {
      business.rejectionReason = reason;
    }

    await business.save();

    res.json({ 
      message: `Business ${status} successfully`,
      business: {
        id: business._id,
        name: business.name,
        email: business.email,
        verificationStatus: business.verificationStatus
      }
    });
  } catch (error) {
    console.error('Business verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/places - Get all places for moderation
router.get('/places', auth, checkAdminRole, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const places = await Place.find()
      .populate('owner', 'name email userType')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Place.countDocuments();

    res.json({
      places,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPlaces: total
    });
  } catch (error) {
    console.error('Get places error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/admin/places/:id - Delete a place
router.delete('/places/:id', auth, checkAdminRole, async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    await Place.findByIdAndDelete(req.params.id);
    
    // Also delete associated reviews
    await Review.deleteMany({ place: req.params.id });

    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    console.error('Delete place error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/reviews - Get all reviews for moderation
router.get('/reviews', auth, checkAdminRole, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const flagged = req.query.flagged === 'true';

    let query = {};
    if (flagged) {
      query.isFlagged = true;
    }

    const reviews = await Review.find(query)
      .populate('user', 'name email userType')
      .populate('place', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(query);

    res.json({
      reviews,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/reviews/:id/moderate - Moderate a review
router.put('/reviews/:id/moderate', auth, checkAdminRole, async (req, res) => {
  try {
    const { action, reason } = req.body; // action: 'approve', 'hide', 'delete'
    
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    switch (action) {
      case 'approve':
        review.isFlagged = false;
        review.isVisible = true;
        break;
      case 'hide':
        review.isVisible = false;
        review.moderationReason = reason;
        break;
      case 'delete':
        await Review.findByIdAndDelete(req.params.id);
        return res.json({ message: 'Review deleted successfully' });
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    await review.save();
    res.json({ message: `Review ${action}ed successfully` });
  } catch (error) {
    console.error('Review moderation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/recent-activity - Get recent platform activity
router.get('/recent-activity', auth, checkAdminRole, async (req, res) => {
  try {
    const recentUsers = await User.find({ userType: 'student' })
      .select('name email verificationStatus createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentPlaces = await Place.find()
      .populate('owner', 'name')
      .select('name owner createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentReviews = await Review.find()
      .populate('user', 'name')
      .populate('place', 'name')
      .select('user place rating createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      recentUsers,
      recentPlaces,
      recentReviews
    });
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;