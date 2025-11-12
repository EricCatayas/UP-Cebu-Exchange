export const getImageUrl = (images) => {
  const primaryImage = images.find((img) => img.isPrimary);
  return primaryImage ? primaryImage.imageUrl : images[0]?.imageUrl || '';
};
