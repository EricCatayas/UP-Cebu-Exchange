import { RentalOrderDTO } from '@/models/RentalOrder';
import { ORDER_STATUS, PAYMENT_STATUS } from '@/lib/constants';

export function getDaysRemaining(order: { startDate: Date; endDate: Date }): number {
  const today = new Date();
  const endDate = new Date(order.endDate);
  if (order.startDate > today) {
    return Math.ceil((endDate.getTime() - order.startDate.getTime()) / (1000 * 60 * 60 * 24));
  } else {
    const dayDiff = endDate.getTime() - today.getTime();
    return dayDiff > 0 ? Math.ceil(dayDiff / (1000 * 60 * 60 * 24)) : 0;
  }
}

export function getOrderStatus(order: RentalOrderDTO): string {
  const today = new Date();
  const startDate = new Date(order.startDate);
  const endDate = new Date(order.endDate);

  if (order.payment.status === PAYMENT_STATUS.PENDING) {
    return `Payment ${ORDER_STATUS.PENDING}`;
  }

  if (order.payment.status === PAYMENT_STATUS.FAILED) {
    return `Payment ${PAYMENT_STATUS.FAILED}`;
  }

  if (
    today < endDate &&
    order.payment.status === PAYMENT_STATUS.COMPLETED &&
    (order.status !== ORDER_STATUS.ONGOING || order.status === ORDER_STATUS.CONFIRMED)
  ) {
    return ORDER_STATUS.TORECEIVE;
  }

  if (today > endDate && (order.status === ORDER_STATUS.ONGOING || order.status !== ORDER_STATUS.COMPLETED)) {
    return ORDER_STATUS.TORETURN;
  }

  return order.status;
}

export const fmt = (d: Date) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
