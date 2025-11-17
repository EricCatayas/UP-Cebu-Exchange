export interface ArtworkImageAttributes {
  id: number;
  artworkId: number;
  imageUrl: string;
  isPrimary: boolean;
  createdAt: Date;
}

export interface ArtworkImageDTO extends ArtworkImageAttributes {}
