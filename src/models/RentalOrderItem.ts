import { ArtworkDTO } from '@/models/Artwork';
export interface RentalOrderItemAttributes {
  id: number;
  rentalOrderId: number;
  artworkId: number;
  amount: number;
}

export interface RentalOrderItemDTO extends RentalOrderItemAttributes {
  artwork: ArtworkDTO;
}
