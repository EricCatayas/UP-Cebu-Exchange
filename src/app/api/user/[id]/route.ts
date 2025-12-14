import { NextRequest, NextResponse } from 'next/server';
import { User, Role } from '@/models/sequelize';
import { hashPassword } from '@/lib/auth';
import { USER_ROLES, USER_STATUS } from '@/lib/constants';
import { getCurrentUser, isAdmin, canEditContent } from '@/lib/auth';

// Both admin and the user themselves can update user info
// but only admin can change roles
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = parseInt((await params).id);

    if (currentUser.userId != userId && !canEditContent(currentUser)) {
      return NextResponse.json({ error: 'Unauthorized to update user' }, { status: 401 });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { fullName, phoneNumber, password, newPassword, role } = await request.json();

    if (role && !canEditContent(currentUser)) {
      return NextResponse.json({ error: 'Unauthorized to change role' }, { status: 401 });
    }
    if (role && !USER_ROLES.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Validate password strength
    if (newPassword && newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }
    // Password must contain at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
    if (newPassword && !passwordRegex.test(newPassword)) {
      return NextResponse.json({ error: 'Password must contain at least one letter and one number' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    if (password && user.password !== hashedPassword) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    const hashedNewPassword = await hashPassword(newPassword);

    const userRole = role
      ? await Role.findOne({
          where: { name: role },
        })
      : await Role.findByPk(user.roleId);

    const updatedUser = await user.update({
      fullName: fullName || user.fullName,
      phoneNumber: phoneNumber || user.phoneNumber,
      password: newPassword ? hashedNewPassword : user.password,
      roleId: userRole ? userRole.id : user.roleId,
    });

    return NextResponse.json(
      {
        message: 'User update successful',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          fullName: updatedUser.fullName,
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
