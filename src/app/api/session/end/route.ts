import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, endSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (session) {
      await endSession();
    }
    return NextResponse.json(
      {
        message: 'Session ended successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
