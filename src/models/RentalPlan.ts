export interface RentalPlan {
  id: number;
  artworkId: number;
  durationMonths: number; // e.g., 3, 6, 12
  rentalFee: number;
  createdAt: number;
  updatedAt: number;
}
