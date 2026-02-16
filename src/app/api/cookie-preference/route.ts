import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { UserCookiePreference } from '@/models/sequelize';

const VALID_PREFERENCES = new Set(['accept', 'reject']);

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const preference = await UserCookiePreference.findOne({
      where: { userId: user.userId },
      attributes: ['preference'],
      raw: true,
    });

    return NextResponse.json({
      preference: preference?.preference ?? null,
    });
  } catch (error) {
    console.error('Cookie preference fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { preference } = await request.json();

    if (!VALID_PREFERENCES.has(preference)) {
      return NextResponse.json({ error: 'Invalid cookie preference' }, { status: 400 });
    }

    const existing = await UserCookiePreference.findOne({ where: { userId: user.userId } });

    if (existing) {
      await existing.update({ preference });
    } else {
      await UserCookiePreference.create({ userId: user.userId, preference });
    }

    return NextResponse.json({ preference });
  } catch (error) {
    console.error('Cookie preference update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
