import React from 'react';
import Link from 'next/link';
import AnnualDateRange from '@/components/AnnualDateRange/AnnualDateRange';
import PageHeader from '@/components/PageHeader/PageHeader';
import RentalOrderService from '@/services/RentalOrderService';
import { OrderDateRange } from '@/types/OrderDateRange';
import { getDaysRemaining } from '@/lib/date';
import { getCurrentUser } from '@/lib/auth';

async function RentalsPage() {
  const user = await getCurrentUser();
  const rentalOrderService = new RentalOrderService();

  const rentalOrders = await rentalOrderService.getUserOrders(user?.userId);

  const dateRanges: OrderDateRange[] = rentalOrders.map((order) => ({
    startDate: new Date(order.startDate),
    endDate: new Date(order.endDate),
    remainingDays: getDaysRemaining(order),
    status: order.status,
  }));

  const fmt = (d: Date) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

  return (
    <>
      <PageHeader title="My Rentals" />

      <div className="container mx-auto px-4 py-4">
        <AnnualDateRange dateRanges={dateRanges} />

        <div className="mt-10 mb-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rentalOrders.map((order) => {
            const daysLeft = getDaysRemaining(order);
            return (
              <div key={order.id} className="rounded-xl border border-gray-200 bg-white shadow-sm">
                {/* Header */}
                <div
                  className={`rounded-t-xl py-2 px-4 mb-4 flex items-center justify-between border-b border-b-gray-200 bg-${order.status.toLowerCase()}`}
                >
                  <span className="text-sm text-gray-600">Order ID: {order.id}</span>
                  <span className="text-sm font-medium text-gray-800">{daysLeft} days left</span>
                </div>

                {/* Content */}
                <dl className="text-sm space-y-2 px-4">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Order Date</dt>
                    <dd className="text-gray-900">{fmt(order.createdAt)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Rental Period</dt>
                    <dd className="text-gray-900">
                      {fmt(order.startDate)} → {fmt(order.endDate)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Duration</dt>
                    <dd className="text-gray-900">{order.durationMonths} months</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Remaining</dt>
                    <dd className="text-gray-900">{daysLeft} days</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Status</dt>
                    <dd className="text-gray-900">{order.status}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Payment Method</dt>
                    <dd className="text-gray-900">{order.payment.method}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Artworks</dt>
                    <dd className="text-gray-900">{order.rentalOrderItems.length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Total Amount</dt>
                    <dd className="text-gray-900">₱{order.payment.amount.toLocaleString('en-PH')}</dd>
                  </div>
                </dl>

                {/* Links */}
                <div className="px-4 my-4 flex flex-wrap gap-4 text-sm">
                  <Link href={`/account/rentals/${order.id}`} className="text-blue-600 hover:underline">
                    View Products
                  </Link>
                  <Link href={`/account/rentals/${order.id}/extend`} className="text-blue-600 hover:underline">
                    Extend Plan
                  </Link>
                  <Link href={`/account/rentals/${order.id}/return`} className="text-blue-600 hover:underline">
                    Return Products
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default RentalsPage;
