import { ArtworkDTO } from '@/models/Artwork';
export interface CartItemAttributes {
  id: number;
  cartId: number;
  artworkId: number;
  createdAt: Date;
}

export interface CartItemDTO {
  id: number;
  cartId: number;
  artworkId: number;
  artwork: ArtworkDTO;
  createdAt: Date;
  isAvailable: boolean;
}
