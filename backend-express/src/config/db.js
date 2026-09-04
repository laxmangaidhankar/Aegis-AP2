const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/aegis_ap2_app';
    await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 2000
    });
    console.log('MongoDB Connected to Application Database');
  } catch (error) {
    console.warn('MongoDB connection unavailable (operating in in-memory session mode for demo):', error.message);
  }
};

module.exports = connectDB;
