export interface PaymentTransactionAttributes {
  id: number;
  paymentId: number;
  transactionType: string;
  amount: number;
  currency: string;
  method: string;

  // Manual payment fields
  recordedByUserId?: number; // Admin who recorded the payment
  imageUrl?: string; // Receipt/proof image URL

  // Common metadata
  metadata?: Record<string, any>;
  transactionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
