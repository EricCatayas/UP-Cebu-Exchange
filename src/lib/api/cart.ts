export const cartApi = {
  addItem: async (artworkId: number) => {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ artworkId }),
    });

    if (!response.ok) {
      throw new Error('Failed to add item to cart');
    }

    return response.json();
  },

  removeItem: async (artworkId: number) => {
    const response = await fetch('/api/cart', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ artworkId }),
    });

    if (!response.ok) {
      throw new Error('Failed to remove item from cart');
    }

    return response.json();
  },
};
