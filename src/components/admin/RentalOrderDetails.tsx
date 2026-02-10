'use client';
import RentalOrderDetails from '@/components/RentalOrderDetails/RentalOrderDetails';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useModal } from '@/contexts/ModalContext';
import { redirect } from 'next/navigation';
import { rentalOrderApi } from '@/lib/api/rentalOrder';
import { paymentApi } from '@/lib/api/payment';
import { getArtworkStatus, isOrderPaid } from '@/lib/order';
import { RentalOrderDTO } from '@/models/RentalOrder';
import { getImageUrl } from '@/lib/artwork';
import {
  ARTWORK_STATUS,
  ARTWORK_STATUSES,
  ORDER_STATUS,
  ORDER_STATUSES,
  PAYMENT_STATUS,
  PAYMENT_STATUSES,
} from '@/lib/constants';

export default function RentalOrderDetailsWrapper({ order }: { order: RentalOrderDTO }) {
  const prevItemsStatus = getArtworkStatus(order);
  const prevOrderStatus = order.status;
  const [itemsStatus, setItemsStatus] = useState(prevItemsStatus || '');
  const [orderStatus, setOrderStatus] = useState(order.status || '');
  const [paymentStatus, setPaymentStatus] = useState(order.payment.status || '');
  const [hasEdited, setHasEdited] = useState(false);
  const { openConfirmation } = useModal();

  function navigateToInventoryDetails(item) {
    redirect(`/inventory/${item.artwork.id}`);
  }

  const handleSelectStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setOrderStatus(newStatus);
    setHasEdited(true);
  };

  const handleSelectItemsStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setItemsStatus(newStatus);
    setHasEdited(true);
  };

  const handleSelectPaymentStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setPaymentStatus(newStatus);
    setHasEdited(true);
  };

  const handleSaveChanges = async () => {
    try {
      if (!order || !hasEdited) return;
      let message = `Are you sure you want to update the order status to "${orderStatus}" and payment status to "${paymentStatus}"?`;

      if (itemsStatus === ARTWORK_STATUS.AVAILABLE && prevItemsStatus !== ARTWORK_STATUS.AVAILABLE) {
        message =
          'Warning: Changing the items status from "AVAILABLE" will mark the items as available for rent. Other users will be able to view and rent these items.';
      }
      if (itemsStatus === ARTWORK_STATUS.RESERVED && prevItemsStatus !== ARTWORK_STATUS.RESERVED) {
        message =
          'Warning: Changing the items status from "RESERVED" will mark the items as reserved for rent. Other users will not be able to rent these items.';
      }
      if (itemsStatus === ARTWORK_STATUS.RENTED && prevItemsStatus !== ARTWORK_STATUS.RENTED) {
        message =
          'Warning: Changing the items status from "RENTED" will mark the items as currently rented out. Other users will not be able to rent these items.';
      }
      if (itemsStatus === ARTWORK_STATUS.UNAVAILABLE && prevItemsStatus !== ARTWORK_STATUS.UNAVAILABLE) {
        message =
          'Warning: Changing the items status from "UNAVAILABLE" will mark the items as not available for rent. Users will not be able to view or rent these items.';
      }

      if (orderStatus === ORDER_STATUS.RESERVED && order.status !== ORDER_STATUS.RESERVED) {
        message =
          'Warning: Changing the order status to "RESERVED" indicates that the order has been reserved. Any users who have the same items in their pending order will be notified that their order has been cancelled.';
      }
      if (orderStatus === ORDER_STATUS.TORECEIVE && order.status !== ORDER_STATUS.TORECEIVE) {
        message =
          'Warning: Changing the order status to "TO RECEIVE" indicates that the order is ready to be received by the customer. The customer will be notified accordingly.';
      }
      if (orderStatus === ORDER_STATUS.TORETURN && order.status !== ORDER_STATUS.TORETURN) {
        message =
          'Warning: Changing the order status to "TO RETURN" indicates that the rental period has ended and the items are due for return. Any associated extensions will also be removed.';
      }
      if (orderStatus === ORDER_STATUS.CANCELLED && order.status !== ORDER_STATUS.CANCELLED) {
        message =
          'Warning: Changing the order status to "CANCELLED" is irreversible and cannot be changed back. Any associated extensions will also be removed.';
      }

      openConfirmation(
        {
          title: 'Confirm Status Update',
          message: message,
        },
        async () => {
          try {
            if (orderStatus !== prevOrderStatus || itemsStatus !== prevItemsStatus) {
              const updatedOrder = await rentalOrderApi.updateStatus(order.id, orderStatus, itemsStatus);
            }
            if (order.payment.status !== paymentStatus) {
              const updatedPayment = await paymentApi.updateStatus(order.payment.id, paymentStatus);
            }
            // page refresh to reflect changes
            alert(`Order has been updated`);
            redirect('/orders');
          } catch (error) {
            alert(error.message);
          }
        }
      );
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const userButtonLabel = 'View User';
  const handleUserClick = (user) => {
    redirect(`/users/${user.id}`);
  };

  const userButton = {
    label: userButtonLabel,
    classes: 'bg-blue-600 text-white rounded hover:bg-blue-700',
    onClick: handleUserClick,
  };

  const paymentButton = {
    label: isOrderPaid(order) ? 'View Receipt' : 'Manage Payment',
    classes: 'bg-green-600 text-white rounded hover:bg-green-700',
    onClick: () => {
      redirect(`/payments/${order.paymentId}`);
    },
  };

  return (
    <div className="container px-8 py-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Rental Order Details</h1>
      <RentalOrderDetails
        order={order}
        onItemClicked={navigateToInventoryDetails}
        userButton={userButton}
        paymentButton={paymentButton}
      />
      <div className="mt-6">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Update Status
          </label>
          {prevOrderStatus === ORDER_STATUS.CANCELLED ? (
            <p className="text-red-600 mb-2">This order has been cancelled. Status changes are not allowed.</p>
          ) : (
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
          )}
        </div>
        <div>
          <label htmlFor="itemsStatus" className="block text-sm font-medium text-gray-700 mb-2">
            Update Items Status
          </label>
          <select
            id="itemsStatus"
            value={itemsStatus}
            onChange={handleSelectItemsStatus}
            className="mt-4 block w-64 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {ARTWORK_STATUSES.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption}
              </option>
            ))}
          </select>
        </div>
        <div>
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
        </div>
        {hasEdited && (
          <button
            onClick={handleSaveChanges}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        )}
        <Link
          href={`/payments/${order.paymentId}`}
          className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          {isOrderPaid(order) ? 'View Receipt' : 'Manage Payment'}
        </Link>
      </div>
    </div>
  );
}
