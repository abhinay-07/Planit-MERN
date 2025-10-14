const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ['bike', 'scooter', 'car', 'auto', 'cycle']
  },
  make: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  fuelType: {
    type: String,
    enum: ['petrol', 'diesel', 'electric', 'hybrid', 'none'],
    required: true
  },
  seatingCapacity: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  images: [{
    url: String,
    caption: String
  }],
  documents: {
    registration: {
      url: String,
      verified: { type: Boolean, default: false }
    },
    insurance: {
      url: String,
      expiryDate: Date,
      verified: { type: Boolean, default: false }
    },
    pollution: {
      url: String,
      expiryDate: Date,
      verified: { type: Boolean, default: false }
    }
  },
  pricing: {
    hourly: Number,
    daily: Number,
    weekly: Number,
    securityDeposit: Number
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
  pickupLocation: {
    address: String,
    landmark: String,
    instructions: String
  },
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    unavailableDates: [{
      startDate: Date,
      endDate: Date,
      reason: String
    }]
  },
  features: [String], // GPS, AC, Music System, etc.
  condition: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'needs_attention'],
    default: 'good'
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  // Verification status
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  // Additional policies
  policies: {
    minimumAge: { type: Number, default: 18 },
    requiresLicense: { type: Boolean, default: true },
    cancellationPolicy: String,
    additionalTerms: String
  }
}, {
  timestamps: true
});

// Geospatial index
vehicleSchema.index({ location: '2dsphere' });

// Index for search
vehicleSchema.index({ vehicleType: 1, 'availability.isAvailable': 1 });

module.exports = mongoose.model('Vehicle', vehicleSchema);