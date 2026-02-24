import NotificationService from '@/services/NotificationService';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/role';
import { Event, Session, UserCookiePreference } from '@/models/sequelize';
import { getCurrentSession, endSession } from '@/lib/session';
import { NOTIFICATION_TYPE } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();

    const user = await getCurrentUser();

    if (user && isAdmin(user)) {
      return NextResponse.json(
        { error: 'Staff members are required to accept cookies to use the application.' },
        { status: 403 }
      );
    }

    // GDPR/CCPA compliance - clear all personally identifiable information from the session and associated events
    if (user) {
      const sessions = await Session.findAll({ where: { userId: user.userId } });
      const sessionIds = sessions.map((s) => s.id);
      await Event.destroy({ where: { sessionId: sessionIds } });
      await Session.destroy({ where: { userId: user.userId } });
      await UserCookiePreference.destroy({ where: { userId: user.userId } });

      const notificationService = new NotificationService();
      await notificationService.create(
        `Session cleared`,
        NOTIFICATION_TYPE.SYSTEM_ALERT,
        `User ${user.email} cleared their browsing data. All sessions and events associated with this user have been deleted for privacy compliance.`
      );
      return NextResponse.json({ message: 'User browsing data cleared successfully' });
    } else if (session) {
      await endSession();
      return NextResponse.json({ message: 'Session cleared successfully' });
    } else {
      return NextResponse.json({ error: 'No active session to clear' }, { status: 400 });
    }
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
