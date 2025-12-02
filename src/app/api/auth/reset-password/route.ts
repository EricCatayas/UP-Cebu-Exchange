import EmailService from '@/services/EmailService';
import { NextRequest, NextResponse } from 'next/server';
import { User, UserPasswordReset } from '@/models/sequelize';
import { ERROR_MESSAGE } from '@/lib/constants';
import { hashPassword } from '@/lib/auth';

// TODO: Test API
export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const passwordResetRecord = await UserPasswordReset.findOne({
      where: { token },
    });

    if (!passwordResetRecord) {
      return NextResponse.json({ error: ERROR_MESSAGE.PASSWORD_RESET_TOKEN_INVALID }, { status: 400 });
    }

    if (passwordResetRecord.expiresAt < new Date()) {
      return NextResponse.json({ error: ERROR_MESSAGE.PASSWORD_RESET_TOKEN_EXPIRED }, { status: 400 });
    }

    const user = await User.findByPk(passwordResetRecord.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
