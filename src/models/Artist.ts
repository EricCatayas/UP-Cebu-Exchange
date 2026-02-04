export interface ArtistAttributes {
  id: number;
  name: string;
  biography?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArtistDTO extends ArtistAttributes {}
