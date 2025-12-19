'use client';
import RentalOrderDetails from '@/components/RentalOrderDetails/RentalOrderDetails';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RentalOrderDTO } from '@/models/RentalOrder';
import { useModal } from '@/contexts/ModalContext';
import { rentalOrderApi } from '@/lib/api/rentalOrder';
import { isOrderCancelable, isOrderReturnable, isPaymentDue } from '@/lib/order';

function RentalOrderDetailsWrapper({ order, action }: { order: RentalOrderDTO; action: string | undefined }) {
  const router = useRouter();
  const { openConfirmation } = useModal();

  const handleRentalItemClicked = (item) => {
    router.push(`/artworks/${item.artwork.id}`);
  };

  const handleCancelOrder = () => {
      openConfirmation({
        title: 'Cancel Order',
        message: 'Are you sure you want to cancel this rental order?',
      }, async () => {
        // Perform cancellation logic here
        try {
            await rentalOrderApi.cancel(order.id);
            router.push(`/account/rentals`);
        } catch (error) {
          alert(error.message);
        }
      });
  };
  const handleReturnOrder = () => {
      openConfirmation({
        title: 'Return Items',
        message: 'Are you sure you want to return the items in this rental order?',
      }, async () => {
        try {
            await rentalOrderApi.return(order.id);
            router.push(`/account/rentals`);
        } catch (error) {
          alert(error.message);
        }
      });
  };

  const handlePayNow = () => {
    router.push(`/account/rentals/${order.id}/payment`);
  };

  useEffect(() => {
    if (action) {
      if (action === 'cancel') {
        handleCancelOrder();
      } else if (action === 'return') {
        handleReturnOrder();
      } else if (action === 'pay') {
        // Redirect to payment page
        router.push(`/account/rentals/${order.id}/payment`);
      }
    }
  }, [action]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Rental Order Details</h1>
      <RentalOrderDetails order={order} onItemClicked={handleRentalItemClicked} />

      <div className="mt-6 flex gap-4">
        {isOrderCancelable(order) && (
          <button onClick={handleCancelOrder} className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Cancel Order
          </button>
        )}
        {isOrderReturnable(order) && (
          <button onClick={handleReturnOrder} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Return Items
          </button>
        )}
        {isPaymentDue(order) && (
          <button onClick={handlePayNow} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Pay Now
          </button>
        )}
      </div>
    </div>
  );
}

export default RentalOrderDetailsWrapper;
