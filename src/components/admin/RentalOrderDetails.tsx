'use client';
import RentalOrderDetails from '@/components/RentalOrderDetails/RentalOrderDetails';
import RentalPeriodCard from '@/components/cards/RentalPeriod/RentalPeriod';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useModal } from '@/contexts/ModalContext';
import { redirect } from 'next/navigation';
import { rentalOrderApi } from '@/lib/api/rentalOrder';
import { paymentApi } from '@/lib/api/payment';
import { getArtworkStatus, isOrderPaid } from '@/lib/order';
import { RentalOrderDTO } from '@/models/RentalOrder';
import { getEndDate } from '@/lib/order';
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
  const prevStartDate = order.startDate.toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(prevStartDate);
  const [endDate, setEndDate] = useState(order.endDate.toISOString().split('T')[0]);
  const [duration, setDuration] = useState(order.durationMonths);
  const [itemsStatus, setItemsStatus] = useState(prevItemsStatus || '');
  const [orderStatus, setOrderStatus] = useState(prevOrderStatus || '');
  const [paymentStatus, setPaymentStatus] = useState(order.payment.status || '');
  const [hasEdited, setHasEdited] = useState(false);
  const { openConfirmation } = useModal();

  function navigateToInventoryDetails(item) {
    redirect(`/admin/inventory/${item.artwork.id}`);
  }

  const handleStartDateChange = (newStartDate: string) => {
    setStartDate(newStartDate);
    setHasEdited(true);

    const newEndDate = getEndDate(newStartDate, duration);
    setEndDate(newEndDate.toISOString().split('T')[0]);
  };

  const handleDurationChange = (newDuration: number) => {
    setHasEdited(true);
    setDuration(newDuration);
    const newEndDate = getEndDate(startDate, newDuration);
    setEndDate(newEndDate.toISOString().split('T')[0]);
  };

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
      let message = `Are you sure you want to update the order details?`;

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
            if (startDate !== prevStartDate || duration !== order.durationMonths) {
              const updatedOrder = await rentalOrderApi.update(order.id, {
                startDate,
                endDate,
                durationMonths: duration,
              });
            }
            // page refresh to reflect changes
            alert(`Order has been updated`);
            redirect('/admin/orders');
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
    redirect(`/admin/users/${user.id}?prev=orders&id=${order.id}`);
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
      redirect(`/admin/payments/${order.paymentId}?prev=orders&id=${order.id}`);
    },
  };

  return (
    <div className="container px-4 py-8 max-w-8xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Rental Order Details</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <RentalOrderDetails
              order={order}
              onItemClicked={navigateToInventoryDetails}
              userButton={userButton}
              paymentButton={paymentButton}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Edit</h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="startDate" className="block text-xs font-semibold text-gray-500 mb-2 uppercase">
                  Start Date
                </label>
                <RentalPeriodCard
                  startDate={startDate}
                  endDate={endDate}
                  duration={duration}
                  onStartDateChange={handleStartDateChange}
                  onDurationChange={handleDurationChange}
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-xs font-semibold text-gray-500 mb-2 uppercase">
                  Order Status
                </label>
                {prevOrderStatus === ORDER_STATUS.CANCELLED ? (
                  <div className="p-3 bg-red-50 border border-gray-300 rounded-lg">
                    <p className="text-xs text-red-600 font-medium">Order is cancelled. Status locked.</p>
                  </div>
                ) : (
                  <select
                    id="status"
                    value={orderStatus}
                    onChange={handleSelectStatus}
                    className="block w-full pl-3 pr-10 py-2.5 text-sm border border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg bg-white transition-shadow"
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
                <label htmlFor="itemsStatus" className="block text-xs font-semibold text-gray-500 mb-2 uppercase">
                  Items Status
                </label>
                <select
                  id="itemsStatus"
                  value={itemsStatus}
                  onChange={handleSelectItemsStatus}
                  className="block w-full pl-3 pr-10 py-2.5 text-sm border border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg bg-white transition-shadow"
                >
                  {ARTWORK_STATUSES.map((statusOption) => (
                    <option key={statusOption} value={statusOption}>
                      {statusOption}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="paymentStatus" className="block text-xs font-semibold text-gray-500 mb-2 uppercase">
                  Payment Status
                </label>
                <select
                  id="paymentStatus"
                  value={paymentStatus}
                  onChange={handleSelectPaymentStatus}
                  className="block w-full pl-3 pr-10 py-2.5 text-sm border border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg bg-white transition-shadow"
                >
                  {PAYMENT_STATUSES.map((statusOption) => (
                    <option key={statusOption} value={statusOption}>
                      {statusOption}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {hasEdited && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSaveChanges}
                  className="w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95 flex justify-center items-center gap-2"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
