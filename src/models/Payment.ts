export interface Payment {
  id: number;
  userId: number;
  rentalOrderId: number;
  amount: number;
  status: "Pending" | "Completed" | "Failed";
  paymentMethod: "CreditCard" | "PayPal";
  createdAt: Date;
}
