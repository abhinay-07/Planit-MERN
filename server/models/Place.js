const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'restaurant',
      'tourist_attraction',
      'shopping',
      'entertainment',
      'accommodation',
      'transport',
      'educational',
      'healthcare',
      'religious',
      'recreation',
      'other'
    ]
  },
  subcategory: {
    type: String,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
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
    pincode: String,
    landmark: String
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  images: [{
    url: String,
    caption: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  operatingHours: {
    monday: { open: String, close: String, isClosed: Boolean },
    tuesday: { open: String, close: String, isClosed: Boolean },
    wednesday: { open: String, close: String, isClosed: Boolean },
    thursday: { open: String, close: String, isClosed: Boolean },
    friday: { open: String, close: String, isClosed: Boolean },
    saturday: { open: String, close: String, isClosed: Boolean },
    sunday: { open: String, close: String, isClosed: Boolean }
  },
  priceRange: {
    type: String,
    enum: ['budget', 'moderate', 'expensive', 'luxury'],
    default: 'moderate'
  },
  amenities: [String],
  ratings: {
    overall: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    student: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    public: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  reviewCount: {
    total: {
      type: Number,
      default: 0
    },
    student: {
      type: Number,
      default: 0
    },
    public: {
      type: Number,
      default: 0
    }
  },
  // For trending calculation
  popularity: {
    views: {
      type: Number,
      default: 0
    },
    weeklyViews: {
      type: Number,
      default: 0
    },
    monthlyViews: {
      type: Number,
      default: 0
    }
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, {
  timestamps: true
});

// Create geospatial index
placeSchema.index({ location: '2dsphere' });

// Index for search
placeSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Place', placeSchema);