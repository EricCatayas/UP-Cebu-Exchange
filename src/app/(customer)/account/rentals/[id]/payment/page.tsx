import React from 'react';
import Link from 'next/link';
import PaymentService from '@/services/PaymentService';
import RentalOrderService from '@/services/RentalOrderService';
import { getImageUrl } from '@/lib/artwork';
import TransactionTable from '@/components/admin/TransactionTable';
import PaymentCard from '@/components/cards/PaymentCard';

export default async function PaymentPage({ params }: { params: { id: string } }) {
  const id = parseInt((await params).id);

  const rentalOrderService = new RentalOrderService();
  const order = await rentalOrderService.getPaymentOrderDetails(id);

  if (!order) {
    return (
      <div className="px-8 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-medium">Rental Order not found</p>
          <Link href="/account/rentals" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to My Rentals
          </Link>
        </div>
      </div>
    );
  }

  const paymentService = new PaymentService();
  const paymentData = await paymentService.getPaymentById(order.paymentId);

  const payment = JSON.parse(JSON.stringify(paymentData));

  const paymentTransactions = paymentData.transactions ? paymentData.transactions.map((tx) => tx.toJSON()) : [];

  return (
    <div className="mt-12 mb-10 max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Section */}
      <header className="mb-8">
        <Link
          href={`/account/rentals/${order.id}`}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors mb-4"
        >
          <span className="mr-2">←</span> Back to Order
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Payment Details</h1>
            <p className="text-sm text-gray-500 mt-1">
              Reference ID: <span className="font-mono font-medium text-gray-700">{payment.id}</span>
            </p>
          </div>
          <div className="flex items-center">
            <span className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase">
              Official Receipt
            </span>
          </div>
        </div>
      </header>

      <div className="space-y-8">
        {/* 1. Payment Summary Card */}
        <section className="bg-white rounded-2xl border border-gray-400 shadow-md overflow-hidden">
          <PaymentCard payment={payment} isReadOnly={true} />
        </section>

        {/* 2. Transactions Table Card */}
        <section className="bg-white rounded-2xl border border-gray-400 shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
          </div>
          <div className="overflow-x-auto">
            <TransactionTable transactions={paymentTransactions} />
          </div>
        </section>

        {/* 3. Rental Items Card */}
        <section className="bg-white rounded-2xl border border-gray-400 shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Rented Artworks</h3>
            <span className="text-xs font-medium text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded">
              {order.items?.length || 0} Items
            </span>
          </div>

          <div className="p-6">
            <div className="divide-y divide-gray-100">
              {order.items?.length ? (
                order.items.map((item) => (
                  <div key={item.id} className="flex items-center py-4 first:pt-0 last:pb-0 group">
                    {item.artwork?.images && (
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100">
                        <img
                          src={getImageUrl(item.artwork)}
                          alt={item.artwork.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    )}
                    <div className="ml-6 flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {item.artwork?.title}
                          </h4>
                          <p className="mt-1 text-xs font-mono text-gray-400">SKU: {item.artwork?.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">₱{item.amount}</p>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-tighter">
                            Amount Due
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 italic">No items listed in this order.</p>
                </div>
              )}
            </div>

            {/* Footer Action */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <Link
                href={`/account/rentals/${order.id}`}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gray-50 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all border border-transparent hover:border-blue-100"
              >
                View Order Details
                <span className="text-lg">→</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
