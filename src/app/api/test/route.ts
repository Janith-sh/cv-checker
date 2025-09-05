import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectToDatabase();

    // Get all users (for debugging - remove in production)
    const users = await User.find({}).select('-password');

    return NextResponse.json({
      message: 'Database connection successful',
      userCount: users.length,
      users: users
    });
  } catch (error: unknown) {
    console.error('Database test error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Database connection failed', details: errorMessage },
      { status: 500 }
    );
  }
}
