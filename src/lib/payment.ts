import { DELIVERY_FEE, DELIVERY_METHOD } from '@/lib/constants';

export function getTotalAmount({ rentalFee, deliveryMethod }: { rentalFee: number; deliveryMethod: string }): number {
  let totalAmount = rentalFee;
  if (deliveryMethod === DELIVERY_METHOD.DELIVERY) {
    totalAmount += DELIVERY_FEE;
  }
  return totalAmount;
}
