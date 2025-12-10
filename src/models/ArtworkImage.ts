export interface ArtworkImageAttributes {
  id: string;
  artworkId: number;
  imageUrl: string;
  isPrimary: boolean;
  createdAt: Date;
}

export interface ArtworkImageDTO extends ArtworkImageAttributes {}
