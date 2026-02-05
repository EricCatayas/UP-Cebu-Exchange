import React from 'react';
import Link from 'next/link';
import AnalyticsCard from '@/components/AnalyticsCard/AnalyticsCard';
import ArtworksTable from '@/components/admin/inventory/ArtworksTable';
import NotificationsTable from '@/components/admin/notifications/NotificationsTable';
import NotificationService from '@/services/NotificationService';

async function Notifications({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const query = await searchParams;

  const page = Number(query.page) || 1;
  const limit = 20;

  const notificationService = new NotificationService();
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Overview</h1>
      </div>

      <div className="mt-8 space-y-12">
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
