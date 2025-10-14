const express = require('express');
const { auth } = require('../middleware/auth');
const Review = require('../models/Review');
const Place = require('../models/Place');

const router = express.Router();

// Get reviews for a place
router.get('/place/:placeId', async (req, res) => {
  try {
    const { page = 1, limit = 10, userType, sortBy = 'createdAt' } = req.query;
    const { placeId } = req.params;

    let query = { place: placeId, isHidden: false };
    
    // Filter by user type if specified
    if (userType) {
      const users = await User.find({ userType }).select('_id');
      const userIds = users.map(user => user._id);
      query.user = { $in: userIds };
    }

    const reviews = await Review.find(query)
      .populate('user', 'name userType profilePicture verificationStatus')
      .sort({ [sortBy]: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(query);

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a review
router.post('/', auth, async (req, res) => {
  try {
    const { place, rating, title, content, aspectRatings, visitDate, visitPurpose } = req.body;

    // Check if user already reviewed this place
    const existingReview = await Review.findOne({ place, user: req.user._id });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this place' });
    }

    // Check if place exists
    const placeExists = await Place.findById(place);
    if (!placeExists) {
      return res.status(404).json({ message: 'Place not found' });
    }

    const review = new Review({
      place,
      user: req.user._id,
      rating,
      title,
      content,
      aspectRatings,
      visitDate,
      visitPurpose
    });

    await review.save();

    // Update place ratings
    await updatePlaceRatings(place);

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name userType profilePicture verificationStatus');

    res.status(201).json({
      message: 'Review added successfully',
      review: populatedReview
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to update place ratings
async function updatePlaceRatings(placeId) {
  try {
    const reviews = await Review.find({ place: placeId, isHidden: false })
      .populate('user', 'userType');

    const studentReviews = reviews.filter(r => r.user.userType === 'student');
    const publicReviews = reviews.filter(r => r.user.userType === 'public');

    const overallRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;

    const studentRating = studentReviews.length > 0 
      ? studentReviews.reduce((sum, r) => sum + r.rating, 0) / studentReviews.length 
      : 0;

    const publicRating = publicReviews.length > 0 
      ? publicReviews.reduce((sum, r) => sum + r.rating, 0) / publicReviews.length 
      : 0;

    await Place.findByIdAndUpdate(placeId, {
      'ratings.overall': Math.round(overallRating * 10) / 10,
      'ratings.student': Math.round(studentRating * 10) / 10,
      'ratings.public': Math.round(publicRating * 10) / 10,
      'reviewCount.total': reviews.length,
      'reviewCount.student': studentReviews.length,
      'reviewCount.public': publicReviews.length
    });
  } catch (error) {
    console.error('Update place ratings error:', error);
  }
}

module.exports = router;