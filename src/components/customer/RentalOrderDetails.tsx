'use client';
import RentalOrderDetails from '@/components/RentalOrderDetails/RentalOrderDetails';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RentalOrderDTO } from '@/models/RentalOrder';
import { useModal } from '@/contexts/ModalContext';
import { rentalOrderApi } from '@/lib/api/rentalOrder';
import { isOrderCancelable, isOrderExtendable, isOrderPaid, isOrderReturnable, isPaymentDue } from '@/lib/order';

function RentalOrderDetailsWrapper({ order, action }: { order: RentalOrderDTO; action: string | undefined }) {
  const router = useRouter();
  const { openConfirmation } = useModal();

  const handleRentalItemClicked = (item) => {
    router.push(`/artworks/${item.artwork.id}`);
  };

  const handleCancelOrder = () => {
    openConfirmation(
      {
        title: 'Cancel Order',
        message:
          'Are you sure you want to cancel this rental order? This action cannot be undone. Any associated extensions will also be removed.',
      },
      async () => {
        try {
          await rentalOrderApi.cancel(order.id);
          router.push(`/account/rentals/${order.id}/cancelled`);
        } catch (error) {
          alert(error.message);
        }
      }
    );
  };
  const handleReturnOrder = () => {
    openConfirmation(
      {
        title: 'Return Items',
        message:
          'Are you sure you want to return the items in this rental order? This action cannot be undone. Any associated extensions will also be removed.',
      },
      async () => {
        try {
          await rentalOrderApi.return(order.id);
          router.push(`/account/rentals/${order.id}/return/request`);
        } catch (error) {
          alert(error.message);
        }
      }
    );
  };

  const handlePayNow = () => {
    openConfirmation(
      {
        title: 'Proceed to Payment',
        message: 'You will be redirected to Stripe to complete the payment.',
      },
      async () => {
        try {
          await rentalOrderApi.pay(order.id);
        } catch (error) {
          alert(error.message);
        }
      }
    );
  };

  const handleExtendOrder = () => {
    openConfirmation(
      {
        title: 'Extend Rental',
        message: 'You will be redirected to extend your rental order.',
      },
      () => {
        router.push(`/account/rentals/${order.id}/extend`);
      }
    );
  };

  useEffect(() => {
    if (action) {
      if (action === 'cancel') {
        handleCancelOrder();
      } else if (action === 'return') {
        handleReturnOrder();
      } else if (action === 'pay') {
        handlePayNow();
      }
    }
  }, [action]);

  const handlePaymentClick = (payment) => {
    if (isPaymentDue(order)) {
      handlePayNow();
    } else if (isOrderPaid(order)) {
      router.push(`/account/rentals/${order.id}/payment`);
    }
  };

  const paymentButton =
    isPaymentDue(order) || isOrderPaid(order)
      ? {
          label: isPaymentDue(order) ? 'Pay Now' : isOrderPaid(order) ? 'View Receipt' : '',
          classes: 'bg-green-600 text-white rounded hover:bg-green-700',
          onClick: handlePaymentClick,
        }
      : null;

  return (
    <div className="mt-12 mb-10 max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <RentalOrderDetails order={order} onItemClicked={handleRentalItemClicked} paymentButton={paymentButton} />

      <div className="mt-6 flex gap-4">
        {isPaymentDue(order) && (
          <button onClick={handlePayNow} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Pay Now
          </button>
        )}
        {isOrderPaid(order) && (
          <button
            onClick={() => router.push(`/account/rentals/${order.id}/payment`)}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            View Receipt
          </button>
        )}
        {isOrderCancelable(order) && (
          <button onClick={handleCancelOrder} className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Cancel Order
          </button>
        )}
        {isOrderExtendable(order) && (
          <button
            onClick={handleExtendOrder}
            className="px-6 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Extend Rental
          </button>
        )}
        {isOrderReturnable(order) && (
          <button onClick={handleReturnOrder} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Return Items
          </button>
        )}
      </div>
    </div>
  );
}

export default RentalOrderDetailsWrapper;
