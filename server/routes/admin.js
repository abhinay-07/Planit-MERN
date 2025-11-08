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

// GET /api/admin/students - Get all students and public users with pagination and filtering
router.get('/students', auth, checkAdminRole, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search;

    // Include both students and public users
    let query = { 
      userType: { $in: ['student', 'public'] }
    };
    
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

    // TODO: Re-enable email notifications later
    // Send email notification to student (COMMENTED OUT)
    // const { sendApprovalEmail, sendRejectionEmail } = require('../utils/emailService');
    // try {
    //   if (status === 'approved') {
    //     await sendApprovalEmail(student.email, student.name);
    //   } else {
    //     await sendRejectionEmail(student.email, student.name, reason);
    //   }
    // } catch (emailError) {
    //   console.error('Failed to send notification email:', emailError);
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
      .populate('addedBy', 'name email userType')
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
      .populate('addedBy', 'name')
      .select('name addedBy createdAt')
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

// POST /api/admin/places - Create a new place
router.post('/places', auth, checkAdminRole, async (req, res) => {
  try {
    const { name, description, category, address, location, image, openingHours, contact } = req.body;

    const place = new Place({
      name,
      description,
      category,
      address,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      },
      images: image ? [{ url: image }] : [],
      operatingHours: openingHours,
      contact,
      addedBy: req.user.userId,
      isVerified: true
    });

    await place.save();
    res.status(201).json({ message: 'Place created successfully', place });
  } catch (error) {
    console.error('Create place error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/places/:id - Update a place
router.put('/places/:id', auth, checkAdminRole, async (req, res) => {
  try {
    const { name, description, category, address, location, image, openingHours, contact } = req.body;
    
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    // Update fields
    if (name) place.name = name;
    if (description) place.description = description;
    if (category) place.category = category;
    if (address) place.address = address;
    if (location) {
      place.location = {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      };
    }
    if (image) place.image = image;
    if (openingHours) place.openingHours = openingHours;
    if (contact) place.contact = contact;

    await place.save();
    res.json({ message: 'Place updated successfully', place });
  } catch (error) {
    console.error('Update place error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/vehicles - Get all vehicles
router.get('/vehicles', auth, checkAdminRole, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const vehicles = await Vehicle.find()
      .populate('owner', 'name email userType')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Vehicle.countDocuments();

    res.json({
      vehicles,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalVehicles: total
    });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/vehicles - Create a new vehicle
router.post('/vehicles', auth, checkAdminRole, async (req, res) => {
  try {
    const { vehicleType, make, model, year, registrationNumber, fuelType, seatingCapacity, pricePerDay, features, images, description } = req.body;

    console.log('Vehicle creation data:', { vehicleType, make, model, year, registrationNumber, fuelType, seatingCapacity, pricePerDay });
    console.log('User from auth:', req.user);

    // Validate required fields
    if (!registrationNumber || !registrationNumber.trim()) {
      return res.status(400).json({ message: 'Registration number is required' });
    }

    const vehicle = new Vehicle({
      owner: req.user._id || req.user.userId || req.user.id,
      vehicleType,
      make,
      model,
      year,
      registrationNumber,
      fuelType,
      seatingCapacity,
      pricing: {
        daily: pricePerDay
      },
      location: {
        type: 'Point',
        coordinates: [80.6480, 16.5062] // Default to Vijayawada [longitude, latitude]
      },
      pickupLocation: {
        address: 'VIT-AP University, Amaravati',
        landmark: 'Near Main Gate',
        instructions: 'Contact owner for pickup details'
      },
      description: description || `${year} ${make} ${model}`,
      features: features || [],
      images: images || [],
      availability: {
        isAvailable: true,
        unavailableDates: []
      },
      isVerified: true,
      verificationStatus: 'approved'
    });

    await vehicle.save();
    res.status(201).json({ message: 'Vehicle created successfully', vehicle });
  } catch (error) {
    console.error('Create vehicle error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/admin/vehicles/:id - Update a vehicle
router.put('/vehicles/:id', auth, checkAdminRole, async (req, res) => {
  try {
    const { vehicleType, make, model, year, registrationNumber, fuelType, seatingCapacity, pricePerDay, features, images, description } = req.body;
    
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Update fields
    if (vehicleType) vehicle.vehicleType = vehicleType;
    if (make) vehicle.make = make;
    if (model) vehicle.model = model;
    if (year) vehicle.year = year;
    if (registrationNumber) vehicle.registrationNumber = registrationNumber;
    if (fuelType) vehicle.fuelType = fuelType;
    if (seatingCapacity) vehicle.seatingCapacity = seatingCapacity;
    if (pricePerDay) vehicle.pricePerDay = pricePerDay;
    if (description) vehicle.description = description;
    if (features) vehicle.features = features;
    if (images) vehicle.images = images;

    await vehicle.save();
    res.json({ message: 'Vehicle updated successfully', vehicle });
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/admin/vehicles/:id - Delete a vehicle
router.delete('/vehicles/:id', auth, checkAdminRole, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/reports/analytics - Get comprehensive analytics
router.get('/reports/analytics', auth, checkAdminRole, async (req, res) => {
  try {
    // User analytics
    const totalUsers = await User.countDocuments({ userType: { $ne: 'admin' } });
    const totalStudents = await User.countDocuments({ userType: 'student' });
    const approvedStudents = await User.countDocuments({ userType: 'student', verificationStatus: 'approved' });
    const pendingStudents = await User.countDocuments({ userType: 'student', verificationStatus: 'pending' });
    const totalBusinesses = await User.countDocuments({ userType: 'business' });
    const approvedBusinesses = await User.countDocuments({ userType: 'business', verificationStatus: 'approved' });

    // Content analytics
    const totalPlaces = await Place.countDocuments();
    const verifiedPlaces = await Place.countDocuments({ isVerified: true });
    const totalVehicles = await Vehicle.countDocuments();
    const availableVehicles = await Vehicle.countDocuments({ availability: true });
    const totalReviews = await Review.countDocuments();

    // Category breakdown
    const placesByCategory = await Place.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const vehiclesByType = await Vehicle.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Rating analytics
    const averageRating = await Review.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    // Growth data (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsersLast30Days = await User.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo },
      userType: { $ne: 'admin' }
    });
    const newPlacesLast30Days = await Place.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const newReviewsLast30Days = await Review.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // Weekly data for charts (last 8 weeks)
    const eightWeeksAgo = new Date(Date.now() - 56 * 24 * 60 * 60 * 1000);
    const weeklyUserGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: eightWeeksAgo }, userType: { $ne: 'admin' } } },
      { 
        $group: { 
          _id: { 
            week: { $week: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } }
    ]);

    const weeklyPlaceGrowth = await Place.aggregate([
      { $match: { createdAt: { $gte: eightWeeksAgo } } },
      { 
        $group: { 
          _id: { 
            week: { $week: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } }
    ]);

    res.json({
      users: {
        total: totalUsers,
        students: {
          total: totalStudents,
          approved: approvedStudents,
          pending: pendingStudents,
          approvalRate: totalStudents > 0 ? ((approvedStudents / totalStudents) * 100).toFixed(1) : 0
        },
        businesses: {
          total: totalBusinesses,
          approved: approvedBusinesses
        },
        newLast30Days: newUsersLast30Days
      },
      content: {
        places: {
          total: totalPlaces,
          verified: verifiedPlaces,
          byCategory: placesByCategory,
          newLast30Days: newPlacesLast30Days
        },
        vehicles: {
          total: totalVehicles,
          available: availableVehicles,
          byType: vehiclesByType
        },
        reviews: {
          total: totalReviews,
          averageRating: averageRating.length > 0 ? averageRating[0].avgRating.toFixed(1) : 0,
          newLast30Days: newReviewsLast30Days
        }
      },
      growth: {
        weeklyUsers: weeklyUserGrowth,
        weeklyPlaces: weeklyPlaceGrowth
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;