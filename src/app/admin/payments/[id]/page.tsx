import React from 'react';
import Link from 'next/link';
import PaymentService from '@/services/PaymentService';
import RentalOrderService from '@/services/RentalOrderService';
import TransactionTable from '@/components/admin/TransactionTable';
import PaymentCard from '@/components/cards/PaymentCard';
import PrevPageLink from '@/components/ui/PrevPageLink';
import { getImageUrl } from '@/lib/artwork';

async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const paymentId = parseInt((await params).id);

  const paymentService = new PaymentService();
  const paymentData = await paymentService.getPaymentById(paymentId);

  if (!paymentData) {
    return (
      <div className="px-8 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-medium">Payment not found</p>
          <PrevPageLink href="/admin/payments" label="Back to Payments" classes="mt-4 inline-block" />
        </div>
      </div>
    );
  }

  const rentalOrderService = new RentalOrderService();
  const order = await rentalOrderService.getPaymentOrderDetails(paymentId);

  // Serialize payment data to plain object for client component
  const payment = JSON.parse(JSON.stringify(paymentData));

  const paymentTransactions = paymentData.transactions ? paymentData.transactions.map((tx) => tx.toJSON()) : [];

  return (
    <div className="px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <PrevPageLink href="/admin/payments" label="Back to Payments" classes="text-sm mb-2 inline-block" />
          <h1 className="text-3xl font-bold text-gray-900">Payment #{payment.id}</h1>
        </div>
      </div>

      <div className="space-y-6">
        {/* Payment Summary Card */}
        <div>
          <PaymentCard payment={payment} />
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Transaction History</h2>
          <TransactionTable transactions={paymentTransactions} />
          <Link
            href={`/admin/payments/${payment.id}/transactions/create`}
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            + Create New Transaction
          </Link>
        </div>
        {/* Rental Items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
          <div className="space-y-3">
            {order.items?.length ? (
              order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center p-4 bg-gray-50 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors border border-gray-200 hover:border-blue-300"
                >
                  {item.artwork?.images && (
                    <img
                      src={getImageUrl(item.artwork)}
                      alt={item.artwork.title}
                      className="w-20 h-20 object-cover rounded-lg mr-4 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-gray-900 truncate">{item.artwork?.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">ID: {item.artwork?.id}</p>
                  </div>
                  <div className="flex-shrink-0 text-right ml-4">
                    <p className="text-xl font-bold text-gray-900">₱{item.amount}</p>
                    <p className="text-xs text-gray-500 mt-1">Rental Amount</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-8">No items in this order</p>
            )}
          </div>
          {/* View Order Details Link */}
          <div className="mt-4 text-right">
            <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:underline font-medium">
              View Order Details →
            </Link>
          </div>
        </div>
      </div>
      {/* Billing Fees */}
      {order.fees && order.fees.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Billing Fees</h3>
          <div className="space-y-3">
            {order.fees.map((fee) => (
              <div
                key={fee.id}
                className="flex items-center p-4 bg-gray-50 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors border border-gray-200 hover:border-blue-300"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-gray-900 truncate">{fee.label}</h4>
                  <p className="text-sm text-gray-600 mt-1">ID: {fee.id}</p>
                  <p className="text-sm text-gray-600 mt-1">Type: {fee.type}</p>
                </div>
                <div className="flex-shrink-0 text-right ml-4">
                  <p className="text-xl font-bold text-gray-900">₱{fee.amount}</p>
                  <p className="text-xs text-gray-500 mt-1">Fee Amount</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentPage;
