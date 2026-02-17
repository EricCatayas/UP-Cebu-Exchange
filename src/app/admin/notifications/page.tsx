import React from 'react';
import Link from 'next/link';
import Header from '@/components/admin/Header';
import AnalyticsCard from '@/components/AnalyticsCard/AnalyticsCard';
import NotificationsTable from '@/components/admin/notifications/NotificationsTable';
import NotificationService from '@/services/NotificationService';

async function Notifications({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const query = await searchParams;

  const timeframe = (query.timeframe as string) || undefined;
  const page = Number(query.page) || 1;
  const limit = 20;

  const notificationService = new NotificationService(timeframe);
  const {
    items: notifications,
    pageSize,
    nextPage,
    previousPage,
    totalPages,
  } = await notificationService.getAll({ page, limit });

  const newCount = notifications.filter((n) => n.createdAt > new Date(Date.now() - 24 * 60 * 60 * 1000)).length;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="px-8 py-6">
      {/* Header */}
      <Header title="Overview" />

      <div className="mt-8 space-y-8">
        {/* Notifications */}
        <section className="flex items-start gap-6">
          <div className="w-28 text-gray-700 font-medium pt-2">Notifications</div>
          <div className="flex flex-wrap gap-6">
            <AnalyticsCard header="Unread" value={unreadCount} />
          </div>
        </section>

        {/* Notifications Table */}
        <section>
          <NotificationsTable
            notifications={notifications}
            page={page}
            pageSize={pageSize}
            nextPage={nextPage}
            previousPage={previousPage}
            totalPages={totalPages}
          />
        </section>
      </div>
    </div>
  );
}

export default Notifications;
