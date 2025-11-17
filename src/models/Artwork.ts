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
