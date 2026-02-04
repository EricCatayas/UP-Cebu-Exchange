import { NextRequest, NextResponse } from 'next/server';
import { User, Role } from '@/models/sequelize';
import { hashPassword } from '@/lib/auth';
import { USER_ROLE, USER_STATUS } from '@/lib/constants';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin, canEditContent } from '@/lib/role';

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !isAdmin(currentUser)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!canEditContent(currentUser)) {
      return NextResponse.json({ error: 'Admin editor access required' }, { status: 403 });
    }

    const { email, password, fullName, phoneNumber, role } = await request.json();

    // Validate input
    if (!email || !password || !fullName || !phoneNumber || !role) {
      return NextResponse.json(
        { error: 'Email, password, full name, phone number, and role are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }
    // Password must contain at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json({ error: 'Password must contain at least one letter and one number' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    // Find customer role (default role for registration)
    const userRole = await Role.findOne({
      where: { name: role },
    });

    if (!userRole) {
      return NextResponse.json({ error: 'User role not found. Please contact administrator.' }, { status: 500 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      phoneNumber,
      fullName,
      roleId: userRole.id,
      status: USER_STATUS.ACTIVE,
    });

    return NextResponse.json(
      {
        message: 'Registration successful',
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          roleName: userRole.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !isAdmin(currentUser)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!canEditContent(currentUser)) {
      return NextResponse.json({ error: 'Admin editor access required' }, { status: 403 });
    }

    const userId = parseInt((await params).id);

    if (!userId || isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const { fullName, phoneNumber, status, role } = await request.json();

    // Validate input
    if (!fullName || !phoneNumber || !status || !role) {
      return NextResponse.json({ error: 'Full name, phone number, status, and role are required' }, { status: 400 });
    }

    // Find user
    const user = await User.findByPk(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find user role
    const userRole = await Role.findOne({
      where: { name: role },
    });

    if (!userRole) {
      return NextResponse.json({ error: 'User role not found. Please contact administrator.' }, { status: 500 });
    }

    // Update user
    await user.update({
      phoneNumber,
      fullName,
      status,
      roleId: userRole.id,
    });

    return NextResponse.json(
      {
        message: 'User updated successfully',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          status: user.status,
          roleName: userRole.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !isAdmin(currentUser)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!canEditContent(currentUser)) {
      return NextResponse.json({ error: 'Admin editor access required' }, { status: 403 });
    }

    const userId = parseInt((await params).id);
    if (!userId || isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    await user.destroy();
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
