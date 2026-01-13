import NotificationService from '@/services/NotificationService';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, isAdmin } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isAdmin(currentUser)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const notificationId = parseInt((await params).id);
  const notificationService = new NotificationService();
  await notificationService.markAsRead(notificationId, currentUser.userId);
  return NextResponse.json({ message: 'Notification marked as read' });
}
