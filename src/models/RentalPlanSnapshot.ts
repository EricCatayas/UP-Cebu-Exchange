export interface RentalPlanSnapshot {
  id: number;
  originalRentalPlanId: number;
  durationMonths: number; // e.g., 3, 6, 12
  rentalFee: number;
  createdAt: number;
}
