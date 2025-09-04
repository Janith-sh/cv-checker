import connectToDatabase from './src/lib/mongodb';

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    await connectToDatabase();
    console.log('✅ MongoDB connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

testConnection();
