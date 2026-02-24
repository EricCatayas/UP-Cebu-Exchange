import NotificationService from '@/services/NotificationService';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/role';

export async function GET(request: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isAdmin(currentUser)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const notificationService = new NotificationService();
  const newNotifications = await notificationService.getAllUnread();

  return NextResponse.json({ notifications: newNotifications });
}
