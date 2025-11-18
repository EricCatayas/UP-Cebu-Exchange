import React from 'react';
import Link from 'next/link';
import { FaTachometerAlt, FaCalendarAlt, FaBox, FaUsers, FaBell, FaChartBar, FaPalette } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  return (
    <aside className="sticky top-0 h-screen w-64 bg-gray-800 text-white">
      <div className="p-4">
        <h2 className="text-lg font-bold">Admin Panel</h2>
      </div>
      <nav className="mt-4">
        <ul>
          <li>
            <Link href="/dashboard" className="flex items-center p-2 hover:bg-gray-700">
              <FaTachometerAlt className="mr-2" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/calendar" className="flex items-center p-2 hover:bg-gray-700">
              <FaCalendarAlt className="mr-2" />
              Calendar
            </Link>
          </li>
          <li>
            <Link href="/orders" className="flex items-center p-2 hover:bg-gray-700">
              <FaBox className="mr-2" />
              Orders
            </Link>
          </li>
          <li>
            <Link href="/inventory" className="flex items-center p-2 hover:bg-gray-700">
              <FaBox className="mr-2" />
              Inventory
            </Link>
          </li>
          <li>
            <Link href="/users" className="flex items-center p-2 hover:bg-gray-700">
              <FaUsers className="mr-2" />
              Users
            </Link>
          </li>
          <li>
            <Link href="/notifications" className="flex items-center p-2 hover:bg-gray-700">
              <FaBell className="mr-2" />
              Notifications
            </Link>
          </li>
          <li>
            <Link href="/reports" className="flex items-center p-2 hover:bg-gray-700">
              <FaChartBar className="mr-2" />
              Reports
            </Link>
          </li>
          <li>
            <Link href="/themes" className="flex items-center p-2 hover:bg-gray-700">
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
