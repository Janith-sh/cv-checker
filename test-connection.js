const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    console.log('JWT Secret:', process.env.JWT_SECRET ? 'Set (length: ' + process.env.JWT_SECRET.length + ')' : 'Not set');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connection successful!');

    // Check users
    const User = require('./src/models/User.ts');
    const users = await User.find({}).select('-password');
    console.log('Users in database:', users.length);
    users.forEach(user => {
      console.log('- Name:', user.name, 'Email:', user.email);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testConnection();
