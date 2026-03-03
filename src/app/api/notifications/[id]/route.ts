import NotificationService from '@/services/NotificationService';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/role';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isAdmin(currentUser)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const notificationId = parseInt((await params).id);
  const notificationService = new NotificationService();
  await notificationService.delete(notificationId);
  return NextResponse.json({ message: 'Notification deleted' });
}
