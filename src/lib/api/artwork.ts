import { create } from 'domain';
import { ArtworkCreateDTO } from '@/models/Artwork';

export const artworkApi = {
  create: async (artworkData: ArtworkCreateDTO) => {
    const response = await fetch('/api/artworks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(artworkData),
    });
    if (!response.ok) {
      throw new Error('Failed to create artwork');
    }
    return response.json();
  },
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
    const response = await fetch(`/api/artworks`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ artworkId }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete artwork');
    }

    return response.json();
  },
};
