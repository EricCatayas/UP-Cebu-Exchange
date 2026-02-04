import { UserDTO } from './User';

export interface PaymentAttributes {
  id: number;
  userId: number;
  amount: number;
  status: 'Pending' | 'Completed' | 'Failed';
  method: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentDTO extends PaymentAttributes {
  user?: UserDTO;
}
