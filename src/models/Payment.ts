export interface PaymentAttributes {
  id: number;
  userId: number;
  amount: number;
  status: 'Pending' | 'Completed' | 'Failed';
  paymentMethod: string;
  createdAt: Date;
  updatedAt?: Date;
}
