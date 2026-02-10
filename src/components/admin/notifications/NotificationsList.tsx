'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { NotificationDTO } from '@/models/Notification';
import { useNotification } from '@/contexts/NotificationContext';
import { notificationApi } from '@/lib/api/notification';
import { notificationTypeUI } from '@/lib/labels';
import { fmtDate } from '@/lib/formatter';

export default function NotificationsList({
  notifications: data,
  newOnly,
}: {
  notifications: NotificationDTO[];
  newOnly?: boolean;
}) {
  const [notifications, setNotifications] = useState(data);
  const newNotificationCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);
  const { hasNewNotifications, setHasNewNotifications } = useNotification();

  const canDisplay = newOnly ? hasNewNotifications : true;

  const handleReadAllNotifications = async () => {
    try {
      await notificationApi.readAll();
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      setHasNewNotifications(false);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    setNotifications(data);
  }, [data]);

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-gray-50 border border-gray-200 rounded-md">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
          <h3 className="text-sm font-semibold text-gray-900">
            {newNotificationCount > 0 && `${newNotificationCount} New `}Notifications
          </h3>
          <button
            onClick={handleReadAllNotifications}
            className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 tGransition"
          >
            Read All
          </button>
        </div>

        <div className="max-h-[150px] overflow-y-auto rounded-md bg-white">
          {notifications.length > 0 && canDisplay ? (
            <ul className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <li key={notification.id} className="flex gap-3 px-3 py-2 text-sm text-gray-700">
                  <div className="flex-shrink-0">{notificationTypeUI(notification.type).icon}</div>
                  <div className="flex-1 flex flex-col gap-1 truncate">
                    <div className="truncate" title={notification.message}>
                      {notification.message}
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium w-fit ${notificationTypeUI(notification.type).color}`}
                    >
                      {fmtDate(notification.createdAt)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-3 py-4 text-sm text-gray-500">No notifications found</div>
          )}
        </div>
      </div>
    </div>
  );
}
