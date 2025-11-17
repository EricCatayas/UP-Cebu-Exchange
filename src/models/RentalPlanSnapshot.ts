export interface RentalPlanSnapshotAttributes {
  id: number;
  originalRentalPlanId: number;
  rentalOrderItemId: number;
  durationMonths: number;
  rentalFee: number;
  createdAt: Date;
}
