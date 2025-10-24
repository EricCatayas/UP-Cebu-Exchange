export interface RentalOrderItem {
  id: number;
  rentalOrderId: number;
  artworkId: number;
  // getRentalFee() : number;
  // getRentalPlan() : number; // if pending { Artwork.RentalPlans.First(r => r.durationMonths === RentalOrder.durationMonths) } else { Where (id === RentalPlanSnapshot.rentalOrderItem) }
}
