import { NextRequest, NextResponse } from 'next/server';
import { User, Role } from '@/models/sequelize';
import { hashPassword } from '@/lib/auth';
import { USER_ROLES, USER_STATUS } from '@/lib/constants';
import { getCurrentUser } from '@/lib/auth';

// User update their own profile, including password change
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = parseInt((await params).id);

    if (currentUser.userId != userId) {
      return NextResponse.json({ error: 'Unauthorized to update user' }, { status: 401 });
    }

    const user = await User.findByPk(userId, {
      include: ['role'],
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { fullName, phoneNumber, password, newPassword } = await request.json();

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

    const updatedUser = await user.update({
      fullName: fullName || user.fullName,
      phoneNumber: phoneNumber || user.phoneNumber,
      password: newPassword ? hashedNewPassword : user.password,
    });

    return NextResponse.json(
      {
        message: 'User update successful',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          fullName: updatedUser.fullName,
          roleName: user.role.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
