import { NextRequest, NextResponse } from 'next/server';
import { User, UserEmailVerification } from '@/models/sequelize';
import crypto from 'crypto';
import EmailService from '@/services/EmailService';

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

    if (user.status === 'Active') {
      return NextResponse.json({ message: 'Email is already verified' }, { status: 200 });
    }

    await UserEmailVerification.destroy({
      where: { userId: user.id },
    });

    const verificationToken = crypto.randomBytes(32).toString('hex');

    await UserEmailVerification.create({
      userId: user.id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Token valid for 24 hours
    });

    const emailService = new EmailService();
    const { success, error } = await emailService.sendEmailVerification(email, verificationToken);

    if (!success) {
      return NextResponse.json({ error: error || 'Failed to send verification email' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Verification email resent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
