const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    enum: [
      'restaurant',
      'shopping',
      'entertainment',
      'services',
      'accommodation',
      'transport',
      'other'
    ]
  },
  discountPercentage: {
    type: Number,
    min: 1,
    max: 100
  },
  discountAmount: {
    type: Number,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discountedPrice: {
    type: Number,
    min: 0
  },
  validFrom: {
    type: Date,
    required: true,
    default: Date.now
  },
  validTill: {
    type: Date,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  terms: {
    type: String,
    maxlength: 1000
  },
  // Target audience
  targetAudience: {
    type: String,
    enum: ['all', 'students', 'public'],
    default: 'all'
  },
  // Usage tracking
  redemptions: {
    type: Number,
    default: 0
  },
  maxRedemptions: {
    type: Number,
    default: null // null means unlimited
  },
  views: {
    type: Number,
    default: 0
  },
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  // Images
  images: [{
    url: String,
    caption: String
  }],
  // Business verification
  businessVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create geospatial index
offerSchema.index({ location: '2dsphere' });

// Index for search and filtering
offerSchema.index({ 
  category: 1, 
  isActive: 1, 
  isApproved: 1, 
  validTill: 1 
});

// Index for text search
offerSchema.index({ 
  title: 'text', 
  description: 'text' 
});

// Auto-expire offers
offerSchema.index({ validTill: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Offer', offerSchema);