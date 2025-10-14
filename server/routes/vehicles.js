const express = require('express');
const { auth } = require('../middleware/auth');
const Vehicle = require('../models/Vehicle');

const router = express.Router();

// Get available vehicles
router.get('/', async (req, res) => {
  try {
    const { 
      vehicleType, 
      lat, 
      lng, 
      radius = 10, 
      page = 1, 
      limit = 20 
    } = req.query;

    let query = { 
      'availability.isAvailable': true,
      isVerified: true,
      verificationStatus: 'approved'
    };
    
    if (vehicleType) {
      query.vehicleType = vehicleType;
    }

    // Location-based filter
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000
        }
      };
    }

    const vehicles = await Vehicle.find(query)
      .populate('owner', 'name phone userType verificationStatus')
      .sort({ 'ratings.average': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Vehicle.countDocuments(query);

    res.json({
      vehicles,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add vehicle
router.post('/', auth, async (req, res) => {
  try {
    const vehicleData = {
      ...req.body,
      owner: req.user._id
    };

    const vehicle = new Vehicle(vehicleData);
    await vehicle.save();

    const populatedVehicle = await Vehicle.findById(vehicle._id)
      .populate('owner', 'name phone userType');

    res.status(201).json({
      message: 'Vehicle added successfully. Pending verification.',
      vehicle: populatedVehicle
    });
  } catch (error) {
    console.error('Add vehicle error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's vehicles
router.get('/my-vehicles', auth, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ vehicles });
  } catch (error) {
    console.error('Get user vehicles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;