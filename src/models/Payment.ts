export interface PaymentAttributes {
  id: number;
  userId: number;
  amount: number;
  status: 'Pending' | 'Completed' | 'Failed';
  method: string;
  createdAt: Date;
  updatedAt?: Date;
}
