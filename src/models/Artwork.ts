import { ArtistDTO } from '@/models/Artist';
import { ArtworkImageDTO } from '@/models/ArtworkImage';
import { RentalPlanDTO } from '@/models/RentalPlan';
import { StyleDTO } from '@/models/Style';
import { TagDTO } from '@/models/Tag';

export interface ArtworkAttributes {
  id: number;
  title?: string;
  artistId?: number;
  description?: string;
  medium: string;
  styleId?: number;
  heightCm?: number;
  widthCm?: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArtworkDTO extends ArtworkAttributes {
  artist?: ArtistDTO;
  images?: ArtworkImageDTO[];
  isInCart?: boolean;
  isInWishlist?: boolean;
  rentalPlans?: RentalPlanDTO[];
  style?: StyleDTO;
  tags?: TagDTO[];
}
