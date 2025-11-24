export const artworkApi = {
  updateStatus: async (artworkId: number, status: string) => {
    const response = await fetch('/api/artworks/status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ artworkId, status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update artwork status');
    }

    return response.json();
  },

  delete: async (artworkId: number) => {
    const response = await fetch(`/api/artworks/${artworkId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete artwork');
    }

    return response.json();
  },
};
