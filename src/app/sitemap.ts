import type { MetadataRoute } from 'next';
import ArtworkService from '@/services/ArtworkService';
import ArtistService from '@/services/ArtistService';
import { ARTWORK_STATUS } from '@/lib/constants';
import { absoluteUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: absoluteUrl('/artworks'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/about'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/faq'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/team'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: absoluteUrl('/privacy-policy'),
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: absoluteUrl('/terms-of-use'),
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  try {
    const artworkService = new ArtworkService();
    const artworks = await artworkService.getPaginatedArtworks({
        limit: 10000,
      page: 1,
      status: [ARTWORK_STATUS.AVAILABLE, ARTWORK_STATUS.RESERVED, ARTWORK_STATUS.RENTED],
    });

    const artworkRoutes: MetadataRoute.Sitemap = artworks.items.map((artwork) => ({
        url: absoluteUrl(`/artworks/${artwork.id}`),
      lastModified: artwork.updatedAt ? new Date(artwork.updatedAt) : now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
    
    // const artists = await ArtistService.getAllArtists({});
    // const artistRoutes: MetadataRoute.Sitemap = artists.map((artist) => ({
    //   url: absoluteUrl(`/artists/${artist.id}`),
    //   lastModified: artist.updatedAt ? new Date(artist.updatedAt) : now,
    //   changeFrequency: 'weekly',
    //   priority: 0.7,
    // }));

    return [...staticRoutes, ...artworkRoutes];
  } catch {
    return staticRoutes;
  }
}
