import { AddressDTO, AddressCreateDTO } from '@/models/Address';
import { PaymentDTO } from '@/models/Payment';
import { RentalOrderItemDTO } from '@/models/RentalOrderItem';
import { UserDTO } from '@/models/User';

export interface RentalOrderAttributes {
  id: number;
  userId: number;
  addressId: number;
  paymentId: number;
  startDate: Date;
  endDate: Date;
  deliveryMethod?: string;
  durationMonths: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RentalOrderDTO extends RentalOrderAttributes {
  address?: AddressDTO;
  payment?: PaymentDTO;
  user?: UserDTO;
  items?: RentalOrderItemDTO[];
}

export interface RentalOrderCreateDTO {
  address: AddressCreateDTO;
  artworkIds: number[];
  customerId: number;
  durationMonths: number;
  startDate: string;
  endDate: string;
  totalAmount: number;
  deliveryMethod: string;
  paymentMethod: string;
}

export interface CheckoutDTO {
  addressId: number;
  cartItemIds: number[];
  durationMonths: number;
  startDate: string;
  endDate: string;
  totalAmount: number;
  deliveryMethod: string;
  paymentMethod: string;
}
