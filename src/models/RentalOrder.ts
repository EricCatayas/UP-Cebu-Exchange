export interface RentalOrder {
  id: number;
  userId: number;
  startDate: Date;
  endDate: Date;
  durationMonths: number; // e.g., 3, 6, 12
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  createdAt: Date;
  updatedAt: Date;
}
