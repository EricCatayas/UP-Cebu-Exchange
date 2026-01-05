import { NextRequest, NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/auth';
import { getSessionCookie, destroySession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    // Remove JWT cookie
    await removeAuthCookie();

    // Get and destroy database session
    const sessionId = await getSessionCookie();
    if (sessionId) {
      await destroySession(sessionId);
    }

    return NextResponse.json({
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
