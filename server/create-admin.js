const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/planit', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@vitapstudent.ac.in' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@vitapstudent.ac.in',
      password: hashedPassword,
      userType: 'student', // Using student type for VIT email
      role: 'super_admin',
      vitapId: 'ADMIN001',
      phoneNumber: '+91-9999999999',
      isVerified: true,
      emailVerified: true,
      verificationStatus: 'approved',
      branch: 'Computer Science',
      year: 4,
      hostel: 'Admin Block'
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@vitapstudent.ac.in');
    console.log('Password: admin123');
    console.log('Role: super_admin');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error creating admin user:', error);
    await mongoose.disconnect();
  }
};

createAdminUser();