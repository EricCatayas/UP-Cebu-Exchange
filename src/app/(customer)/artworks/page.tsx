import React from 'react';
import ArtworkCard from '@/components/ArtworkCard/ArtworkCard';
import ArtworksFilterBar from '@/components/ArtworksFilterBar/ArtworksFilterBar';
import LineBreak from '@/components/ui/LineBreak';
import PageHeader from '@/components/PageHeader/PageHeader';
import Pagination from '@/components/Pagination/Pagination';
import ArtworkService from '@/services/ArtworkService';
import StylesService from '@/services/StylesService';
import { ARTWORK_MEDIUMS, PAGE_SIZE } from '@/lib/constants';
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
    limit: PAGE_SIZE,
  };

  console.log('Query Params for Service:', queryParams);
  const {
    items: artworks,
    pageSize,
    nextPage,
    previousPage,
    totalPages,
  } = await artworkService.getArtworksForCustomer(queryParams);
  const artworkStyles = await StylesService.getAllStyles();
  const artworkMediums = ARTWORK_MEDIUMS;

  console.log('Artworks fetched:', artworks);
  console.log('Page Size:', pageSize);
  console.log('Next Page:', nextPage);
  console.log('Previous Page:', previousPage);
  console.log('Total Pages:', totalPages);

  return (
    <>
      <PageHeader title="All Artworks" />

      <div className="container mx-auto px-4 pb-8">
        <ArtworksFilterBar mediums={artworkMediums} styles={artworkStyles} />
        <LineBreak />

        {/* Artwork Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 mt-6 space-y-6">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="break-inside-avoid mb-6">
              <ArtworkCard artwork={artwork} />
            </div>
          ))}
        </div>

        {/* No results message */}
        {artworks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No artworks found matching your filters.</p>
          </div>
        )}

        {/* Pagination */}
        <Pagination currentPage={params.page} totalPages={totalPages} nextPage={nextPage} previousPage={previousPage} />
      </div>
    </>
  );
}

export default AllArtworksServerComponent;
