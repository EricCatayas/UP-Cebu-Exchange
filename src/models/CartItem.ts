import { ArtworkDTO } from '@/models/Artwork';
export interface CartItemAttributes {
  id: number;
  cartId: number;
  artworkId: number;
  createdAt: Date;
}

export enum CART_STATUS {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  RENTED = 'RENTED',
  PENDING_ORDER_EXISTS = 'PENDING_ORDER_EXISTS',
}

export interface CartItemDTO {
  id?: number; // null when item is not yet saved to server
  cartId?: number;
  artworkId: number;
  artwork: ArtworkDTO;
  createdAt: Date;
  isAvailable: boolean;
  status: CART_STATUS;
}
