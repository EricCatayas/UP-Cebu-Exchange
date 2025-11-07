import { NextRequest, NextResponse } from 'next/server';
import { User, Role } from '@/models/sequelize';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';

// TODO: Test API
export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json();
    
    // Validate input
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email: email.toLowerCase() }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Find customer role (default role for registration)
    const customerRole = await Role.findOne({
      where: { name: 'Customer' }
    });
    
    if (!customerRole) {
      return NextResponse.json(
        { error: 'Customer role not found. Please contact administrator.' },
        { status: 500 }
      );
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const newUser = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      fullName,
      roleId: customerRole.id,
      status: 'Active' // Todo: In production, set status to 'Pending' and require email verification
    });
    
    // Generate JWT token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      roleId: newUser.roleId,
      roleName: customerRole.name
    });
    
    // Set auth cookie
    await setAuthCookie(token);
    
    return NextResponse.json({
      message: 'Registration successful',
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: customerRole.name
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}