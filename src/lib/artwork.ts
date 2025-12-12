import { ArtworkDTO } from '@/models/Artwork';

export const getImageUrl = (artwork: ArtworkDTO) => {
  const images = artwork.images || [];
  const primaryImage = images.find((img) => img.isPrimary);
  return primaryImage ? primaryImage.imageUrl : images[0]?.imageUrl || '';
};

export const getDimension = (artwork: ArtworkDTO) => {
  return `${artwork.heightCm}cm x ${artwork.widthCm}cm`;
};

export const getRentalFee = (artwork: ArtworkDTO, duration: number) => {
  const plan = artwork.rentalPlans.find((p: any) => p.durationMonths === duration);
  return Number(plan?.price) || 0;
};

export const getTagNames = (artwork: ArtworkDTO): string[] => {
  return artwork.tags ? artwork.tags.map((tag) => tag.name) : [];
};
