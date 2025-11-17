export const getImageUrl = (images) => {
  const primaryImage = images.find((img) => img.isPrimary);
  return primaryImage ? primaryImage.imageUrl : images[0]?.imageUrl || '';
};

export const getDimension = (artwork) => {
  return `${artwork.heightCm}cm x ${artwork.widthCm}cm`;
};

export const getRentalFee = (artwork: any, duration: number) => {
  const plan = artwork.rentalPlans.find((p: any) => p.durationMonths === duration);
  return Number(plan?.rentalFee) || 0;
};
