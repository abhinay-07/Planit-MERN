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
      console.log(`🗺️  Location query: lat=${lat}, lng=${lng}, radius=${radius}km`);
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseFloat(radius) * 1000 // Convert km to meters
        }
      };
      console.log('📍 Query object:', JSON.stringify(query, null, 2));
    }

    console.log(`🔍 Fetching places with query:`, JSON.stringify(query, null, 2));

    // Build query differently based on whether using geolocation
    let places;
    let total;

    if (query.location) {
      // For $near queries, don't use sort/skip/limit in the query
      // $near automatically sorts by distance
      places = await Place.find(query)
        .populate('addedBy', 'name userType');
      
      total = places.length; // Total is same as result count for geolocation
      
      // Manually apply pagination after fetching
      const startIndex = (page - 1) * limit;
      places = places.slice(startIndex, startIndex + (limit * 1));
    } else {
      // For non-geolocation queries, use normal pagination
      places = await Place.find(query)
        .populate('addedBy', 'name userType')
        .sort({ [sortBy]: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
      
      total = await Place.countDocuments(query);
    }

    console.log(`✅ Found ${places.length} places (total: ${total})`);

    res.json({
      success: true,
      data: places,
      places: places, // Keep for backward compatibility
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('❌ Get places error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
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

    res.json({ 
      success: true,
      data: place,
      place: place // Keep for backward compatibility
    });
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