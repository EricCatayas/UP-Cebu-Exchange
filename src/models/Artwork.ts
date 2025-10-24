export interface Artwork {
  id: number;
  title: string;
  artistId?: number;
  description: string;
  medium: string; // e.g., "Oil on Canvas", "Watercolor"
  heightCm: number;
  widthCm: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
