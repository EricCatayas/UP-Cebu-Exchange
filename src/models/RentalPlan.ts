export interface RentalPlanAttributes {
  id: number;
  artworkId: number;
  durationMonths: number;
  rentalFee: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RentalPlanDTO extends RentalPlanAttributes {}
