import { NextRequest, NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/auth';
import { endSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    // Remove auth cookie
    await removeAuthCookie();
    // End session
    await endSession();

    return NextResponse.json({
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
