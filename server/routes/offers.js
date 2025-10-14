const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get current offers
router.get('/', async (req, res) => {
  try {
    const { category, location } = req.query;
    
    // Placeholder for offers functionality
    const sampleOffers = [
      {
        id: 1,
        title: "20% off at Campus Cafe",
        description: "Get 20% discount on all food items",
        category: "restaurant",
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        location: "VIT-AP Campus"
      },
      {
        id: 2,
        title: "Student Special - Movie Tickets",
        description: "Special rates for VIT-AP students",
        category: "entertainment",
        validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        location: "Vijayawada"
      }
    ];

    res.json({ offers: sampleOffers });
  } catch (error) {
    console.error('Get offers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;