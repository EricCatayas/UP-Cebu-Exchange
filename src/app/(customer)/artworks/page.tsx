import React from 'react';
import type { Metadata } from 'next';
import AllArtworks from '@/components/AllArtworks/AllArtworks';
import ArtworkService from '@/services/ArtworkService';
import StylesService from '@/services/StylesService';
import { ARTWORK_MEDIUMS, ARTWORK_STATUS } from '@/lib/constants';
import { getCurrentUser } from '@/lib/auth';
import { absoluteUrl } from '@/lib/seo';

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const query = await searchParams;

  const searchTerm = typeof query.search === 'string' ? query.search.trim() : '';
  const page = Math.max(1, Number(query.page) || 1);

  const pageSuffix = page > 1 ? ` - Page ${page}` : '';
  const title = searchTerm
    ? `Artworks matching "${searchTerm}"${pageSuffix}`
    : `Browse Artworks${pageSuffix}`;

  const canonicalPath = page > 1 ? `/artworks?page=${page}` : '/artworks';

  return {
    title,
    description: 'Browse available, reserved, and rented artworks from UP Cebu student artists.',
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description: 'Browse available, reserved, and rented artworks from UP Cebu student artists.',
      type: 'website',
      url: absoluteUrl(canonicalPath),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: 'Browse available, reserved, and rented artworks from UP Cebu student artists.',
    },
  };
}

async function AllArtworksServerComponent({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const currentUser = await getCurrentUser();
  const artworkService = new ArtworkService(currentUser?.userId);

  const query = await searchParams;

  const params = {
    search: (query.search as string) || undefined,
    sort: query.sort as 'popular' | 'latest' | undefined,
    styles: query.styles || undefined,
    mediums: query.mediums || undefined,
    page: Number(query.page) || 1,
  };

  // Parse comma-separated values
  const styleIds = params.styles?.split(',').map(Number).filter(Boolean) || [];
  const mediumNames = params.mediums?.split(',').filter(Boolean) || [];

  // Fetch filtered artworks from service (or pass params to client component)
  const queryParams = {
    search: params.search,
    sort: params.sort,
    styles: styleIds,
    mediums: mediumNames,
    page: params.page,
    limit: 24,
    status: [ARTWORK_STATUS.AVAILABLE, ARTWORK_STATUS.RESERVED, ARTWORK_STATUS.RENTED],
  };

  const {
    items: artworks,
    pageSize,
    nextPage,
    previousPage,
    totalPages,
  } = await artworkService.getPaginatedArtworks(queryParams);
  const artworkStyles = await StylesService.getAllStyles();
  const artworkMediums = ARTWORK_MEDIUMS;

  return (
    <AllArtworks
      artworks={artworks}
      artworkMediums={artworkMediums}
      artworkStyles={artworkStyles}
      currentpage={params.page}
      totalPages={totalPages}
      nextPage={nextPage}
      previousPage={previousPage}
    />
  );
}

export default AllArtworksServerComponent;
