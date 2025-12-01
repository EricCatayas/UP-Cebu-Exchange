import { NextRequest, NextResponse } from 'next/server';
import { User, UserEmailVerification } from '@/models/sequelize';
import { ERROR_MESSAGE } from '@/lib/constants';
// TODO: Test API
export async function POST(request: NextRequest) {
  // Read token from query.
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  const emailVerification = await UserEmailVerification.findOne({
    where: { token },
  });

  if (!emailVerification) {
    return NextResponse.json({ error: ERROR_MESSAGE.EMAIL_VERIFICATION_TOKEN_INVALID }, { status: 400 });
  }

  if (emailVerification.expiresAt < new Date()) {
    return NextResponse.json({ error: ERROR_MESSAGE.EMAIL_VERIFICATION_TOKEN_EXPIRED }, { status: 400 });
  }

  const user = await User.findByPk(emailVerification.userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  user.status = 'Active';
  await user.save();

  return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });
}
