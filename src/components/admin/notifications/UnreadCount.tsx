'use client';
import AnalyticsCard from '@/components/AnalyticsCard/AnalyticsCard';
import { useMemo } from 'react';
import { useNotification } from '@/contexts/NotificationContext';

export default function UnreadCount() {
  const { newNotifications } = useNotification();
  const unreadCount = useMemo(() => newNotifications.filter((n) => !n.isRead).length, [newNotifications]);
  return <AnalyticsCard header="Unread" value={unreadCount} />;
}
