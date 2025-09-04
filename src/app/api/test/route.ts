import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get all users (for debugging - remove in production)
    const users = await User.find({}).select('-password');

    return NextResponse.json({
      message: 'Database connection successful',
      userCount: users.length,
      users: users
    });
  } catch (error: any) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { error: 'Database connection failed', details: error.message },
      { status: 500 }
    );
  }
}
