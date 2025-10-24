export interface RentalPlanSnapshot {
  id: number;
  originalRentalPlanId: number;
  rentalOrderItemId: number;
  durationMonths: number;
  rentalFee: number;
  createdAt: number;
}
