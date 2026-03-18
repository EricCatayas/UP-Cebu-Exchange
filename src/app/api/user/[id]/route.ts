import { NextRequest, NextResponse } from 'next/server';
import { User, Role, RentalOrder } from '@/models/sequelize';
import { hashPassword } from '@/lib/auth';
import { USER_ROLE, USER_STATUS } from '@/lib/constants';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin, canManageUsers } from '@/lib/role';
import { validateFullName, validatePhoneNumber } from '@/lib/validators';

// Admin edit user info, including role and status
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !isAdmin(currentUser)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!canManageUsers(currentUser)) {
      return NextResponse.json({ error: 'Admin full privileges required' }, { status: 403 });
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

    // Validate full name
    const fullNameValidation = validateFullName(fullName);
    if (!fullNameValidation.isValid) {
      return NextResponse.json({ error: fullNameValidation.message }, { status: 400 });
    }

    // Validate phone number
    const phoneValidation = validatePhoneNumber(phoneNumber);
    if (!phoneValidation.isValid) {
      return NextResponse.json({ error: phoneValidation.message }, { status: 400 });
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

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !isAdmin(currentUser)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!canManageUsers(currentUser)) {
      return NextResponse.json({ error: 'Admin full privileges required' }, { status: 403 });
    }

    const userId = parseInt((await params).id);
    if (!userId || isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const hasAnyOrders = await RentalOrder.findOne({
      where: { userId },
    });
    if (hasAnyOrders) {
      return NextResponse.json({ error: 'Cannot delete user with existing rental orders' }, { status: 400 });
    }
    await user.destroy();
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
