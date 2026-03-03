import React from 'react';
import AllArtworks from '@/components/AllArtworks/AllArtworks';
import ArtworkService from '@/services/ArtworkService';
import StylesService from '@/services/StylesService';
import { ARTWORK_MEDIUMS } from '@/lib/constants';
import { getCurrentUser } from '@/lib/auth';

async function AllArtworksServerComponent({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
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
