export interface PaymentTransactionAttributes {
  id: number;
  paymentId: number;
  transactionType: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';

  // Manual payment fields
  recordedByUserId?: number; // Admin who recorded the payment
  paymentProofUrl?: string; // Receipt/proof image URL

  // Common metadata
  metadata?: Record<string, any>;
  transactionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
