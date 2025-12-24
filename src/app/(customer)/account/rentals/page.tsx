import React from 'react';
import Link from 'next/link';
import AnnualDateRange from '@/components/AnnualDateRange/AnnualDateRange';
import PageHeader from '@/components/PageHeader/PageHeader';
import RentalOrderCard from '@/components/RentalOrderCard/RentalOrderCard';
import RentalOrderService from '@/services/RentalOrderService';
import { OrderDateRange } from '@/types/OrderDateRange';
import { getDaysRemaining, isOrderCancelable, isOrderReturnable, isPaymentDue } from '@/lib/order';
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

  return (
    <>
      <PageHeader title="My Rentals" />

      <div className="container mx-auto px-4 py-4">
        <AnnualDateRange dateRanges={dateRanges} />

        <div className="mt-10 mb-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rentalOrders.map((order) => (
            <RentalOrderCard key={order.id} order={order}>
              <>
                <Link href={`/account/rentals/${order.id}`} className="text-blue-600 hover:underline">
                  View Products
                </Link>
                <Link href={`/account/rentals/${order.id}?action=extend`} className="text-blue-600 hover:underline">
                  Extend Plan
                </Link>
                {isPaymentDue(order) && (
                  <Link href={`/account/rentals/${order.id}/payment`} className="text-blue-600 hover:underline">
                    Pay Now
                  </Link>
                )}
                {isOrderCancelable(order) && (
                  <Link href={`/account/rentals/${order.id}?action=cancel`} className="text-blue-600 hover:underline">
                    Cancel Order
                  </Link>
                )}
                {isOrderReturnable(order) && (
                  <Link href={`/account/rentals/${order.id}?action=return`} className="text-blue-600 hover:underline">
                    Return Products
                  </Link>
                )}
              </>
            </RentalOrderCard>
          ))}
        </div>
      </div>
    </>
  );
}

export default RentalsPage;
