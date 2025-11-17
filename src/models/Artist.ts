export interface ArtistAttributes {
  id: number;
  name: string;
  biography?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArtistDTO extends ArtistAttributes {}
