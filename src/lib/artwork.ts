import { ARTWORK_STATUS } from './constants';
import { ArtworkDTO } from '@/models/Artwork';

export const getPrimaryImage = (artwork: ArtworkDTO) => {
  const images = artwork.images || [];
  return images.find((img) => img.isPrimary) || null;
};

export const getImageUrl = (artwork: ArtworkDTO) => {
  const images = artwork.images || [];
  const primaryImage = getPrimaryImage(artwork);
  return primaryImage ? primaryImage.imageUrl : images[0]?.imageUrl || '';
};

export const getImageUrls = (artwork: ArtworkDTO): string[] => {
  const images = artwork.images || [];
  return images.map((img) => img.imageUrl);
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

export const isAvailableForRental = (artwork: ArtworkDTO): boolean => {
  return artwork.status === ARTWORK_STATUS.AVAILABLE;
};
