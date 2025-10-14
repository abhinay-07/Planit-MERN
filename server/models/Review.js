const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  images: [{
    url: String,
    caption: String
  }],
  // Detailed ratings
  aspectRatings: {
    cleanliness: { type: Number, min: 1, max: 5 },
    service: { type: Number, min: 1, max: 5 },
    valueForMoney: { type: Number, min: 1, max: 5 },
    ambiance: { type: Number, min: 1, max: 5 },
    accessibility: { type: Number, min: 1, max: 5 }
  },
  // Visit details
  visitDate: {
    type: Date,
    required: true
  },
  visitPurpose: {
    type: String,
    enum: ['leisure', 'business', 'academic', 'family', 'friends', 'solo', 'other']
  },
  // Helpful votes
  helpfulVotes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isHelpful: Boolean
  }],
  helpfulCount: {
    type: Number,
    default: 0
  },
  // Verification status
  isVerified: {
    type: Boolean,
    default: false
  },
  // For moderation
  reportCount: {
    type: Number,
    default: 0
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  isFlagged: {
    type: Boolean,
    default: false
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  moderationReason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate reviews from same user for same place
reviewSchema.index({ place: 1, user: 1 }, { unique: true });

// Index for efficient querying
reviewSchema.index({ place: 1, rating: -1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);