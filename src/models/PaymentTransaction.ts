export interface PaymentTransactionAttributes {
  id: number;
  paymentId: number;
  transactionType: string;
  amount: number;
  currency: string;
  method: string;

  // Manual payment fields
  recordedByUserId?: number | null; // Admin who recorded the payment
  imageUrl?: string | null; // Receipt/proof image URL

  // Common metadata
  metadata?: Record<string, any> | null;
  transactionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
