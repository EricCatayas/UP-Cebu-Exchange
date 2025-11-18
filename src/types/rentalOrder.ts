export type RentalOrder = {
  id: number;
  userId: number;
  startDate: Date;
  endDate: Date;
  durationMonths: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  createdAt: Date;
  updatedAt: Date;

  items: RentalOrderItem[];

  getTotalRentalFee(): number;
};

export type RentalOrderItem = {
  id: number;
  rentalOrderId: number;
  artworkId: number;
  getRentalFee(): number;
  getRentalPlan(): number;
};
