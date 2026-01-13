'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/contexts/ModalContext';
import { NotificationDTO } from '@/models/Notification';
import { NOTIFICATION_TYPE } from '@/lib/constants';
import { notificationApi } from '@/lib/api/notification';
import { FaSearch, FaCheck, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function NotificationsTable({
  notifications: data,
  page,
  pageSize,
  nextPage,
  previousPage,
  totalPages,
}: {
  notifications: NotificationDTO[];
  page: number;
  pageSize: number;
  nextPage?: number;
  previousPage?: number;
  totalPages: number;
}) {
  const [notifications, setNotifications] = useState(data);
  const router = useRouter();
  const { openConfirmation } = useModal();

  const handleReadNotification = async (notificationId: number) => {
    try {
      await notificationApi.read(notificationId);
      setNotifications(notifications.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleReadAllNotifications = async () => {
    try {
      await notificationApi.readAll();
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    openConfirmation(
      {
        title: 'Delete Notification',
        message: 'Are you sure you want to delete this notification?',
      },
      async () => {
        try {
          await notificationApi.delete(notificationId);
          setNotifications(notifications.filter((n) => n.id !== notificationId));
        } catch (error) {
          alert(error.message);
        }
      },
      () => {}
    );
  };

  const handleNextPage = () => {
    router.push(`?page=${nextPage}`);
  };

  const handlePreviousPage = () => {
    router.push(`?page=${previousPage}`);
  };

  const handleSelectPage = (selectedPage: number) => {
    router.push(`?page=${selectedPage}`);
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case NOTIFICATION_TYPE.SYSTEM_ALERT:
        return 'bg-blue-100 text-blue-800';
      case NOTIFICATION_TYPE.NEW_ORDER:
        return 'bg-green-100 text-green-800';
      case NOTIFICATION_TYPE.ORDER_UPDATE:
        return 'bg-yellow-100 text-yellow-800';
      case 'extra':
        return 'bg-purple-100 text-purple-800';
      case 'extra1':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleReadAllNotifications}
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Mark All as Read
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <tr key={notification.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{notification.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getNotificationTypeColor(
                        notification.type
                      )}`}
                    >
                      {notification.type.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium max-w-xs truncate">
                    {notification.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-md truncate">{notification.message}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        notification.isRead ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {notification.isRead ? 'Read' : 'Unread'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(notification.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-3">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleReadNotification(notification.id)}
                          className="text-green-600 hover:text-green-800 font-medium transition"
                          title="Mark as read"
                        >
                          <FaCheck />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="text-red-600 hover:text-red-800 font-medium transition"
                        title="Delete notification"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No notifications found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </div>

          <div className="flex gap-2 items-center">
            <button
              onClick={handlePreviousPage}
              disabled={!previousPage}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <FaChevronLeft /> Previous
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handleSelectPage(pageNum)}
                  className={`px-3 py-2 rounded text-sm transition ${
                    pageNum === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={!nextPage}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
