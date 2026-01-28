import { RentalOrderDTO } from '@/models/RentalOrder';
import { ORDER_STATUS, PAYMENT_STATUS } from '@/lib/constants';
import { CART_STATUS } from '@/models/CartItem';
import { orderStatus } from '@/lib/labels';

export function getDaysRemaining(order: RentalOrderDTO): number {
  const today = new Date();
  const endDate = new Date(order.endDate);
  if (order.startDate > today) {
    return Math.ceil((endDate.getTime() - order.startDate.getTime()) / (1000 * 60 * 60 * 24));
  } else {
    const dayDiff = endDate.getTime() - today.getTime();
    return dayDiff > 0 ? Math.ceil(dayDiff / (1000 * 60 * 60 * 24)) : 0;
  }
}

export function getOrderStatus(order: RentalOrderDTO): { label: string; value: string; color: string } {
  const today = new Date();
  const startDate = new Date(order.startDate);
  const endDate = new Date(order.endDate);

  if (order.status === ORDER_STATUS.CANCELLED) {
    return { label: 'Order Cancelled', value: order.status, color: orderStatus.cancelled.color };
  }

  if (order.payment.status === PAYMENT_STATUS.PENDING) {
    return orderStatus['Payment Pending'];
  }

  if (order.payment.status === PAYMENT_STATUS.FAILED) {
    return orderStatus['Payment Failed'];
  }

  // Todo: auto update status based on date and condition. Then remove these lines later.
  if (
    today >= startDate &&
    order.payment.status === PAYMENT_STATUS.COMPLETED &&
    order.status === ORDER_STATUS.RESERVED
  ) {
    // if today is one week after start date: overdue receive
    if ((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) > 7) {
      return orderStatus['To Receive Overdue'];
    }
    return orderStatus[ORDER_STATUS.TORECEIVE];
  }

  if (today > endDate && (order.status === ORDER_STATUS.ONGOING || order.status !== ORDER_STATUS.COMPLETED)) {
    // if today is two weeks after end date: overdue return
    if ((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24) > 14) {
      return orderStatus['Overdue Return'];
    }
    // if today is one week after end date: to return
    return orderStatus[ORDER_STATUS.TORETURN];
  }

  return {
    label: order.status,
    value: order.status,
    color: orderStatus[order.status]?.color || 'bg-gray-100 text-gray-800',
  };
}

export const getUnavailableReason = (status: CART_STATUS) => {
  switch (status) {
    case CART_STATUS.UNAVAILABLE:
      return 'This artwork is currently not available for rent.';
    case CART_STATUS.RENTED:
      return 'This artwork is currently rented out.';
    case CART_STATUS.PENDING_ORDER_EXISTS:
      return 'This artwork is in a pending order.';
    default:
      return null;
  }
};

export function isOrderOverdue(order: RentalOrderDTO): boolean {
  const today = new Date();
  const endDate = new Date(order.endDate);
  return today > endDate && order.status === ORDER_STATUS.ONGOING;
}

export function isPaymentDue(order: RentalOrderDTO): boolean {
  return order.payment?.status === PAYMENT_STATUS.PENDING && order.status === ORDER_STATUS.PENDING;
}

export function isOrderCancelable(order: RentalOrderDTO): boolean {
  const today = new Date();
  const startDate = new Date(order.startDate);
  // I.e. order has not been delivered yet
  return (
    order.status === ORDER_STATUS.PENDING ||
    order.status === ORDER_STATUS.RESERVED ||
    order.status === ORDER_STATUS.TORECEIVE
  );
}

export function isOrderExtendable(order: RentalOrderDTO): boolean {
  const today = new Date();
  const endDate = new Date(order.endDate);
  return order.status !== ORDER_STATUS.CANCELLED && order.status !== ORDER_STATUS.COMPLETED;
}

export function isOrderReturnable(order: RentalOrderDTO): boolean {
  return order.status === ORDER_STATUS.ONGOING;
}
