import EmailService from '@/services/EmailService';
import { NextRequest, NextResponse } from 'next/server';
import { User, UserPasswordReset } from '@/models/sequelize';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    const user = await User.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const token = generateToken();

    await UserPasswordReset.create({
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // Token valid for 1 hour
    });

    const emailService = new EmailService();
    const { success, error } = await emailService.sendPasswordReset(email, token);
    if (!success) {
      return NextResponse.json({ error: error || 'Failed to send verification email' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Verification email resent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
