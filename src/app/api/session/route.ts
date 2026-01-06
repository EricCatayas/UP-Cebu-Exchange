import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { hasSession, createSession, getCurrentSession } from '@/lib/session';

// TODO: Test API
export async function GET(request: NextRequest) {
  try {
    const hasSessionStored = await hasSession();

    if (hasSessionStored) {
      console.log('Existing session found.');
      const session = await getCurrentSession();
      return NextResponse.json({
        sessionId: session.sessionId,
      });
    } else {
      console.log('No session found, creating a new one.');
      const user = await getCurrentUser();
      const newSessionId = await createSession(user ? user.userId : undefined);
      return NextResponse.json({
        sessionId: newSessionId,
      });
    }
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
