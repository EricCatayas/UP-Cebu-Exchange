'use client';
import RentalOrderDetails from '@/components/RentalOrderDetails/RentalOrderDetails';
import { useState, useEffect } from 'react';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '@/lib/constants';
import { rentalOrderApi } from '@/lib/api/rentalOrder';
import { paymentApi } from '@/lib/api/payment';
import { redirect } from 'next/navigation';
import { RentalOrderDTO } from '@/models/RentalOrder';
import { useModal } from '@/contexts/ModalContext';
import { getImageUrl } from '@/lib/artwork';

export default function RentalOrderDetailsWrapper({ order }: { order: RentalOrderDTO }) {
  const [orderStatus, setOrderStatus] = useState(order.status || '');
  const [paymentStatus, setPaymentStatus] = useState(order.payment.status || '');
  const [hasEdited, setHasEdited] = useState(false);
  const { openConfirmation } = useModal();

  const handleSelectStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    try {
      setOrderStatus(newStatus);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  function navigateToInventoryDetails(item) {
    redirect(`/inventory/${item.artwork.id}`);
  }

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
      const updatedOrder = await rentalOrderApi.updateStatus(order.id, orderStatus);
      const updatedPayment = await paymentApi.updateStatus(order.payment.id, paymentStatus);

      alert(`Order has been updated`);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleDeleteOrder = async () => {
    openConfirmation(
      {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this order?',
      },
      async () => {
        try {
          await rentalOrderApi.delete(order.id);
          alert('Order has been deleted');
          redirect('/orders');
        } catch (error) {
          alert('Failed to delete order:', error.message);
        }
      }
    );
  };

  useEffect(() => {
    if (orderStatus !== order.status || paymentStatus !== order.payment.status) {
      setHasEdited(true);
    } else {
      setHasEdited(false);
    }
  }, [orderStatus, paymentStatus]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Rental Order Details</h1>
      <RentalOrderDetails order={order} onItemClicked={navigateToInventoryDetails} />
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
        <button
          onClick={handleDeleteOrder}
          className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Delete Order
        </button>
      </div>
    </div>
  );
}
