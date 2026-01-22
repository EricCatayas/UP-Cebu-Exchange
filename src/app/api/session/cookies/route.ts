import EventService from '@/services/EventService';
import { setCookiePreference } from '@/lib/cookies-server';
import { getCurrentSession } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const { preference } = await request.json();
    if (preference !== 'accept' && preference !== 'reject') {
      return new Response(JSON.stringify({ error: 'Invalid preference' }), { status: 400 });
    }
    await setCookiePreference(preference);

    const session = await getCurrentSession();
    if (session) {
      const eventService = new EventService(session.id);
      await eventService.setCookiePreference(preference);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error setting cookie preference:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
