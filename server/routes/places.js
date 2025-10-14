const express = require('express');
const { auth } = require('../middleware/auth');
const Place = require('../models/Place');

const router = express.Router();

// Get all places with filters
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      search, 
      lat, 
      lng, 
      radius = 10, 
      page = 1, 
      limit = 20,
      sortBy = 'ratings.overall'
    } = req.query;

    let query = {};
    
    // Category filter
    if (category) {
      query.category = category;
    }

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Location-based filter
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    }

    const places = await Place.find(query)
      .populate('addedBy', 'name userType')
      .sort({ [sortBy]: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Place.countDocuments(query);

    res.json({
      places,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get places error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single place
router.get('/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id)
      .populate('addedBy', 'name userType profilePicture');

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    // Increment view count
    await Place.findByIdAndUpdate(req.params.id, {
      $inc: { 
        'popularity.views': 1,
        'popularity.weeklyViews': 1,
        'popularity.monthlyViews': 1
      }
    });

    res.json({ place });
  } catch (error) {
    console.error('Get place error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new place
router.post('/', auth, async (req, res) => {
  try {
    const placeData = {
      ...req.body,
      addedBy: req.user._id
    };

    const place = new Place(placeData);
    await place.save();

    const populatedPlace = await Place.findById(place._id)
      .populate('addedBy', 'name userType');

    res.status(201).json({
      message: 'Place added successfully',
      place: populatedPlace
    });
  } catch (error) {
    console.error('Add place error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get trending places (Top Picks of the Week)
router.get('/trending/weekly', async (req, res) => {
  try {
    const places = await Place.find()
      .populate('addedBy', 'name userType')
      .sort({ 'popularity.weeklyViews': -1, 'ratings.overall': -1 })
      .limit(10);

    res.json({ places });
  } catch (error) {
    console.error('Get trending places error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;