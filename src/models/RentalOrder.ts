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

export interface RentalOrderCreateDTO {
  cartItemIds: number[];
  durationMonths: number;
  startDate: string;
  endDate: string;
  totalAmount: number;
  deliveryMethod: string;
  paymentMethod: string;
}
