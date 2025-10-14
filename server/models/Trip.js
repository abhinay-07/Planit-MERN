const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  user: {
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
    maxlength: 500
  },
  // Trip routes and waypoints
  origin: {
    name: String,
    coordinates: [Number], // [longitude, latitude]
    address: String
  },
  destination: {
    name: String,
    coordinates: [Number], // [longitude, latitude]
    address: String
  },
  waypoints: [{
    name: String,
    coordinates: [Number],
    address: String,
    order: Number
  }],
  // Trip details
  distance: {
    type: Number, // in kilometers
    required: true
  },
  estimatedDuration: {
    type: Number, // in minutes
    required: true
  },
  travelMode: {
    type: String,
    enum: ['driving', 'walking', 'bicycling', 'transit'],
    required: true
  },
  // Cost estimations
  estimatedCost: {
    fuel: Number,
    tolls: Number,
    parking: Number,
    food: Number,
    accommodation: Number,
    activities: Number,
    total: Number
  },
  // Group details
  groupSize: {
    type: Number,
    min: 1,
    max: 20,
    default: 1
  },
  isGroupTrip: {
    type: Boolean,
    default: false
  },
  groupMembers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['invited', 'accepted', 'declined'],
      default: 'invited'
    }
  }],
  // Trip dates
  plannedStartDate: Date,
  plannedEndDate: Date,
  actualStartDate: Date,
  actualEndDate: Date,
  // Trip status
  status: {
    type: String,
    enum: ['planning', 'confirmed', 'ongoing', 'completed', 'cancelled'],
    default: 'planning'
  },
  // Vehicle rental integration
  vehicleRental: {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle'
    },
    rentalPeriod: {
      start: Date,
      end: Date
    },
    totalCost: Number,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled']
    }
  },
  // Places to visit
  places: [{
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place'
    },
    plannedVisitTime: Date,
    duration: Number, // minutes
    priority: {
      type: String,
      enum: ['must-visit', 'optional', 'backup'],
      default: 'must-visit'
    },
    notes: String
  }],
  // Trip visibility
  isPublic: {
    type: Boolean,
    default: false
  },
  // Reviews and ratings (post-trip)
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    maxlength: 1000
  },
  // Budget tracking
  budget: {
    planned: Number,
    actual: Number
  },
  // Weather considerations
  weatherAlerts: [{
    date: Date,
    alert: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high']
    }
  }],
  // Emergency contacts
  emergencyContacts: [{
    name: String,
    phone: String,
    relation: String
  }],
  // Trip images and memories
  photos: [{
    url: String,
    caption: String,
    location: {
      coordinates: [Number],
      placeName: String
    },
    takenAt: Date
  }]
}, {
  timestamps: true
});

// Indexes for efficient querying
tripSchema.index({ user: 1, status: 1, createdAt: -1 });
tripSchema.index({ 'origin.coordinates': '2dsphere' });
tripSchema.index({ 'destination.coordinates': '2dsphere' });
tripSchema.index({ plannedStartDate: 1, plannedEndDate: 1 });

module.exports = mongoose.model('Trip', tripSchema);