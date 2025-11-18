export interface RentalOrderAttributes {
  id: number;
  userId: number;
  paymentId?: number;
  startDate: Date;
  endDate: Date;
  deliveryMethod?: string;
  durationMonths: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  createdAt: Date;
  updatedAt: Date;
}
