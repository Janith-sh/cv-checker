import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    console.log('Login attempt started');
    await connectToDatabase();
    console.log('Database connected');

    const { email, password } = await request.json();
    console.log('Login data received:', { email, password: '***' });

    // Validate input
    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json(
        { error: 'Please provide email and password' },
        { status: 400 }
      );
    }

    // Find user and include password for comparison
    console.log('Looking for user with email:', email);
    const user = await User.findOne({ email }).select('+password');
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('User found, checking password');
    console.log('Stored password hash starts with:', user.password.substring(0, 10) + '...');
    console.log('Input password length:', password.length);

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    console.log('Password comparison result:', isPasswordValid);

    // Also try direct bcrypt comparison for debugging
    const directComparison = await bcrypt.compare(password, user.password);
    console.log('Direct bcrypt comparison:', directComparison);

    if (!isPasswordValid) {
      console.log('Invalid password');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('Password valid, generating token');
    console.log('JWT_SECRET available:', process.env.JWT_SECRET ? 'Yes' : 'No');
    console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    console.log('Token generated successfully, length:', token.length);
    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    // Create response with token in cookie
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: userResponse,
      },
      { status: 200 }
    );

    // Set token in httpOnly cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: false, // Allow in development over HTTP
      sameSite: 'lax', // More permissive for development
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/', // Ensure cookie is available for all paths
    });

    console.log('Cookie set successfully');

    return response;
  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
