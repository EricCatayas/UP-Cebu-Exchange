import React from 'react';
import Link from 'next/link';
import AnnualDateRange from '@/components/AnnualDateRange/AnnualDateRange';
import PageHeader from '@/components/PageHeader/PageHeader';
import RentalOrderCard from '@/components/cards/RentalOrder/RentalOrder';
import RentalOrderService from '@/services/RentalOrderService';
import { OrderDateRange } from '@/types/OrderDateRange';
import { getDaysRemaining, getOrderStatus } from '@/lib/order';
import { fmtDate } from '@/lib/formatter';

async function CalendarPage() {
  const rentalOrderService = new RentalOrderService();

  const rentalOrders = await rentalOrderService.getAllOrders();

  const dateRanges: OrderDateRange[] = rentalOrders.map((order) => ({
    startDate: new Date(order.startDate),
    endDate: new Date(order.endDate),
    remainingDays: getDaysRemaining(order),
    status: order.status,
    statusColor: getOrderStatus(order).color,
  }));

  return (
    <div className="px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Calendar</h1>
        <Link
          href="/admin/orders/create"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Create New Order
        </Link>
      </div>
      <div className="mt-8 space-y-8">
        <AnnualDateRange dateRanges={dateRanges} />

        <div className="mt-10 mb-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rentalOrders.map((order) => (
            <RentalOrderCard key={order.id} order={order}>
              <>
                <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:underline">
                  View Details
                </Link>
              </>
            </RentalOrderCard>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
