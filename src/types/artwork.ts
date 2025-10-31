export type Artwork = {
  id: number;
  title: string;
  artistId?: number;
  description: string;
  medium: string;
  heightCm: number;
  widthCm: number;
  createdAt: Date;
  updatedAt: Date;

  artist: Artist;
  styles: Style[];
  tags: Tag[];
  subjects: Subject[];

  isAvailable(): boolean;
};

export type Artist = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Style = {
  id: number;
  name: string;
};

export type Tag = {
  id: number;
  name: string;
};

export type Subject = {
  id: number;
  name: string;
};
