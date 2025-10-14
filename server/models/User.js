const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email) {
        if (this.userType === 'student') {
          // VIT-AP email validation
          return /^[a-zA-Z0-9._%+-]+@vitapstudent\.ac\.in$/i.test(email);
        }
        // General email validation for public users
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: function(props) {
        if (this.userType === 'student') {
          return 'Students must use their VIT-AP email address (@vitapstudent.ac.in)';
        }
        return 'Please provide a valid email address';
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  userType: {
    type: String,
    enum: ['student', 'public', 'business', 'admin'],
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'super_admin'],
    default: function() {
      return this.userType === 'admin' ? 'admin' : 'user';
    }
  },
  // VIT-AP specific fields for students
  vitapId: {
    type: String,
    sparse: true, // Allows null for non-student users
    unique: true
  },
  year: {
    type: String,
    enum: ['1', '2', '3', '4'],
    required: function() { return this.userType === 'student'; }
  },
  branch: {
    type: String,
    required: function() { return this.userType === 'student'; }
  },
  // Common fields
  phone: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String, // Cloudinary URL
    default: ''
  },
  // Email verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    sparse: true
  },
  emailVerificationExpires: {
    type: Date
  },
  // For student verification (additional layer after email verification)
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: function() { 
      if (this.userType === 'student') return 'pending';
      if (this.userType === 'business') return 'pending';
      return 'approved'; 
    }
  },
  // VIT-specific verification documents for students
  verificationDocuments: {
    studentId: String, // URL to uploaded student ID
    idCard: String, // URL to uploaded ID card
    additionalDocs: [String]
  },
  // Preferences
  preferences: {
    favoriteCategories: [String],
    travelRadius: {
      type: Number,
      default: 50 // km
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);