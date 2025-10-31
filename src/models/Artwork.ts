export interface Artwork {
  id: number;
  title: string;
  artistId?: number;
  description: string;
  medium: string; // e.g., "Oil on Canvas", "Watercolor"
  heightCm: number;
  widthCm: number;
  createdAt: Date;
  updatedAt: Date;
}
