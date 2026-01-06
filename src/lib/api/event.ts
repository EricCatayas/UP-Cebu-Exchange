import { EVENT_CATEGORY, EVENT_NAME, EVENT_ENTITY_TYPE } from '@/lib/constants';
import { ArtworkQueryParams } from '@/models/Artwork';
import { sign } from 'crypto';

export const eventApi = {
  async visitSite(): Promise<{ success: boolean; error: string | null }> {
    try {
      const response = await fetch('/api/event/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: EVENT_NAME.VISIT_SITE,
          category: EVENT_CATEGORY.DISCOVERY,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        const error = data.error;
        return { success: false, error };
      }
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Error logging visit site event' };
    }
  },
  async browseArtworks(): Promise<{ success: boolean; error: string | null }> {
    try {
      const response = await fetch('/api/event/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: EVENT_NAME.BROWSE_ARTWORKS,
          category: EVENT_CATEGORY.DISCOVERY,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        const error = data.error;
        return { success: false, error };
      }
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Error logging browse artworks event' };
    }
  },
  async searchArtworks(query: ArtworkQueryParams): Promise<{ success: boolean; error: string | null }> {
    try {
      const response = await fetch('/api/event/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: EVENT_NAME.SEARCH_ARTWORKS,
          category: EVENT_CATEGORY.DISCOVERY,
          metadata: query,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        const error = data.error;
        return { success: false, error };
      }
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Error logging search artworks event' };
    }
  },
  async viewArtwork(artworkId: number): Promise<{ success: boolean; error: string | null }> {
    try {
      const response = await fetch('/api/event/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: EVENT_NAME.VIEW_ARTWORK,
          category: EVENT_CATEGORY.ENGAGEMENT,
          entityType: EVENT_ENTITY_TYPE.ARTWORK,
          entityId: artworkId,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        const error = data.error;
        return { success: false, error };
      }
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Error logging view artwork event' };
    }
  },

  async addToCart(artworkId: number): Promise<{ success: boolean; error: string | null }> {
    try {
      const response = await fetch('/api/event/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: EVENT_NAME.ADD_TO_CART,
          category: EVENT_CATEGORY.INTEREST,
          entityType: EVENT_ENTITY_TYPE.ARTWORK,
          entityId: artworkId,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        const error = data.error;
        return { success: false, error };
      }
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Error logging add to cart event' };
    }
  },
  async addToWishlist(artworkId: number): Promise<{ success: boolean; error: string | null }> {
    try {
      const response = await fetch('/api/event/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: EVENT_NAME.ADD_TO_WISHLIST,
          category: EVENT_CATEGORY.INTEREST,
          entityType: EVENT_ENTITY_TYPE.ARTWORK,
          entityId: artworkId,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        const error = data.error;
        return { success: false, error };
      }
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Error logging add to wishlist event' };
    }
  },
  async beginCheckout(): Promise<{ success: boolean; error: string | null }> {
    try {
      const response = await fetch('/api/event/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: EVENT_NAME.BEGIN_CHECKOUT,
          category: EVENT_CATEGORY.INTENT,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        const error = data.error;
        return { success: false, error };
      }
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Error logging begin checkout event' };
    }
  },
  async setAddress(): Promise<{ success: boolean; error: string | null }> {
    try {
      const response = await fetch('/api/event/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: EVENT_NAME.SET_ADDRESS,
          category: EVENT_CATEGORY.INTENT,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        const error = data.error;
        return { success: false, error };
      }
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Error logging set address event' };
    }
  },
  async signRentalAgreement(): Promise<{ success: boolean; error: string | null }> {
    try {
      const response = await fetch('/api/event/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: EVENT_NAME.SIGN_RENTAL_AGREEMENT,
          category: EVENT_CATEGORY.INTENT,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        const error = data.error;
        return { success: false, error };
      }
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Error logging sign rental agreement event' };
    }
  },
};
