import { DELIVERY_FEE, DELIVERY_METHOD } from '@/lib/constants';

export function getTotalAmount({
  rentalFee,
  deliveryMethod,
  additionalFees,
}: {
  rentalFee: number;
  deliveryMethod?: string;
  additionalFees?: number;
}): number {
  let totalAmount = rentalFee;
  if (deliveryMethod && deliveryMethod === DELIVERY_METHOD.DELIVERY) {
    totalAmount += DELIVERY_FEE;
  }
  if (additionalFees) {
    totalAmount += additionalFees;
  }
  return totalAmount;
}
