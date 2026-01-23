import NotificationService from '@/services/NotificationService';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/role';

export async function PUT() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isAdmin(currentUser)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const notificationService = new NotificationService();
  await notificationService.markAllAsRead(currentUser.userId);
  return NextResponse.json({ message: 'All notifications marked as read' });
}
