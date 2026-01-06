import EventService from '@/services/EventService';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/session';
import { EVENT_CATEGORY, EVENT_NAME, EVENT_ENTITY_TYPE } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, eventName, entityType, entityId, metadata } = body;

    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json({ error: 'No active session' }, { status: 400 });
    }

    console.log('Logging event:', { eventName, category, entityType, entityId, metadata });

    const eventService = new EventService(session.id);
    await eventService.logEvent(eventName, category, entityType, entityId, metadata);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
