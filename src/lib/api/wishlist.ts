export const wishlistApi = {
  addItem: async (artworkId: number) => {
    const response = await fetch('/api/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ artworkId }),
    });
    if (!response.ok) {
      throw new Error('Failed to add item to wishlist');
    }
    return response.json();
  },
  removeItem: async (artworkId: number) => {
    const response = await fetch('/api/wishlist', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ artworkId }),
    });
    if (!response.ok) {
      throw new Error('Failed to remove item from wishlist');
    }
    return response.json();
  },
};
