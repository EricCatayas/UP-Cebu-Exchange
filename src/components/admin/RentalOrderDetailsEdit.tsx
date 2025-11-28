'use client';
import { useState, useEffect } from 'react';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '@/lib/constants';
import { rentalOrderApi } from '@/lib/api/rentalOrder';
import { paymentApi } from '@/lib/api/payment';
import { RentalOrderDTO } from '@/models/RentalOrder';

export default function RentalOrderDetailsEdit({ order }: { order: RentalOrderDTO }) {
  const [orderStatus, setOrderStatus] = useState(order.status || '');
  const [paymentStatus, setPaymentStatus] = useState(order.payment.status || '');
  const [hasEdited, setHasEdited] = useState(false);

  const handleSelectStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    try {
      setOrderStatus(newStatus);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleSelectPaymentStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    try {
      setPaymentStatus(newStatus);
    } catch (error) {
      console.error('Failed to update payment status:', error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (!order || !hasEdited) return;
      const updatedOrder = await rentalOrderApi.updateRentalOrderStatus(order.id, orderStatus);
      const updatedPayment = await paymentApi.updateStatus(order.payment.id, paymentStatus);

      alert(`Order has been updated`);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  useEffect(() => {
    if (orderStatus !== order.status || paymentStatus !== order.payment.status) {
      setHasEdited(true);
    } else {
      setHasEdited(false);
    }
  }, [orderStatus, paymentStatus]);

  return (
    <div className="mt-6">
      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
        Update Status
      </label>
      <select
        id="status"
        value={orderStatus}
        onChange={handleSelectStatus}
        className="mt-1 block w-64 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        {ORDER_STATUSES.map((statusOption) => (
          <option key={statusOption} value={statusOption}>
            {statusOption}
          </option>
        ))}
      </select>
      <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 mb-2">
        Update Payment Status
      </label>
      <select
        id="paymentStatus"
        value={paymentStatus}
        onChange={handleSelectPaymentStatus}
        className="mt-4 block w-64 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        {PAYMENT_STATUSES.map((statusOption) => (
          <option key={statusOption} value={statusOption}>
            {statusOption}
          </option>
        ))}
      </select>
      <button
        onClick={handleSaveChanges}
        disabled={!hasEdited}
        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Save Changes
      </button>
    </div>
  );
}
