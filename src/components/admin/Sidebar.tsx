'use client';
import React from 'react';
import Link from 'next/link';
import { useNotification } from '@/contexts/NotificationContext';
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaBox,
  FaUsers,
  FaMoneyBillWave,
  FaBell,
  FaChartBar,
  FaPalette,
  FaTruck,
} from 'react-icons/fa';

const Sidebar: React.FC = () => {
  const { hasNewNotifications } = useNotification();
  return (
    <aside className="sticky top-0 h-screen w-64 bg-gray-800 text-white">
      <div className="p-4">
        <Link href="/">
          <h2 className="text-lg font-bold">UP Cebu Exchange</h2>
        </Link>
      </div>
      <nav className="mt-4">
        <ul>
          <li>
            <Link href="/admin" className="flex items-center p-2 hover:bg-gray-700">
              <FaTachometerAlt className="mr-2" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/admin/calendar" className="flex items-center p-2 hover:bg-gray-700">
              <FaCalendarAlt className="mr-2" />
              Calendar
            </Link>
          </li>
          <li>
            <Link href="/admin/orders" className="flex items-center p-2 hover:bg-gray-700">
              <FaTruck className="mr-2" />
              Orders
            </Link>
          </li>
          <li>
            <Link href="/admin/inventory" className="flex items-center p-2 hover:bg-gray-700">
              <FaBox className="mr-2" />
              Inventory
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className="flex items-center p-2 hover:bg-gray-700">
              <FaUsers className="mr-2" />
              Users
            </Link>
          </li>
          <li>
            <Link href="/admin/payments" className="flex items-center p-2 hover:bg-gray-700">
              <FaMoneyBillWave className="mr-2" />
              Payments
            </Link>
          </li>
          <li>
            <Link href="/admin/notifications" className="flex items-center p-2 hover:bg-gray-700">
              <div className="relative mr-2">
                <FaBell />
                {hasNewNotifications && (
                  <span className="absolute -top-1 -right-1 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
                )}
              </div>
              Notifications
            </Link>
          </li>
          <li>
            <Link href="/admin/notifications" className="flex items-center p-2 hover:bg-gray-700">
              <FaChartBar className="mr-2" />
              Reports
            </Link>
          </li>
          <li>
            <Link href="/admin/notifications" className="flex items-center p-2 hover:bg-gray-700">
              <FaPalette className="mr-2" />
              Themes
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
