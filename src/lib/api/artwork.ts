import { ArtworkCreateDTO, ArtworkEditDTO } from '@/models/Artwork';

export const artworkApi = {
  create: async (artworkData: ArtworkCreateDTO) => {
    const formData = new FormData();

    Object.entries(artworkData).forEach(([key, value]) => {
      if (key !== 'images' && value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    if (artworkData.images && artworkData.images.length > 0) {
      artworkData.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await fetch('/api/artworks', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to create artwork');
    }

    return response.json();
  },
  edit: async (artworkData: ArtworkEditDTO) => {
    const formData = new FormData();

    Object.entries(artworkData).forEach(([key, value]) => {
      if (key !== 'images' && value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    if (artworkData.images && artworkData.images.length > 0) {
      artworkData.images.forEach((image: File) => {
        formData.append('images', image);
      });
    }

    const response = await fetch(`/api/artworks/${artworkData.id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to edit artwork');
    }
  },

  updateStatus: async (artworkId: number, status: string) => {
    const response = await fetch(`/api/artworks/${artworkId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to update artwork status');
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
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete artwork');
    }

    return response.json();
  },

  deleteImage: async (artworkId: number, imageId: string) => {
    const response = await fetch(`/api/artworks/${artworkId}/image`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageId }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete artwork image');
    }

    return response.json();
  },
};
