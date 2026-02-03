import EventService from '@/services/EventService';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createSession, getCurrentSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSession();

    if (session) {
      console.log('Existing session found.');
      return NextResponse.json({
        sessionId: session.sessionId,
      });
    } else {
      console.log('No session found, creating a new one.');
      const user = await getCurrentUser();
      const newSession = await createSession(user ? user.userId : undefined);
      // Log site visit event for new session
      const eventService = new EventService(newSession.id);
      await eventService.visitSite();
      return NextResponse.json({
        sessionId: newSession.sessionId,
      });
    }
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
