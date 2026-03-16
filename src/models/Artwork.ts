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

export interface ArtworkWithScore extends ArtworkDTO {
  score: number; // similarity score or popularity score
}

export interface ArtworkCreateDTO {
  title?: string;
  artistId?: number;
  artistName?: string;
  description?: string;
  medium: string;
  styleId?: number;
  styleName?: string;
  heightCm?: number;
  widthCm?: number;
  status: string;
  rentalFee3Months: number;
  rentalFee6Months: number;
  rentalFee12Months: number;
  tags: string[];
  images: File[];
}

export interface ArtworkEditDTO extends ArtworkCreateDTO {
  id: number;
  primaryImageId?: string;
}

export interface PaginatedArtworks {
  page: number;
  pageSize: number;
  nextPage?: number;
  previousPage?: number;
  totalPages: number;
  items: ArtworkDTO[];
}

export interface ArtworkQueryParams {
  search?: string;
  sort?: 'popular' | 'latest';
  styles?: number[];
  mediums?: string[];
  page?: number;
  limit: number;
  status?: string[];
}
