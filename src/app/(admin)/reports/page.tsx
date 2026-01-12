import React from 'react';
import AnalyticsCard from '@/components/AnalyticsCard/AnalyticsCard';
import Header from '@/components/admin/Header';
import FunnelAnalyticsService from '@/services/FunnelAnalyticsService';
import ProductDemandService from '@/services/ProductDemandService';
import FunnelAnalyticsBar from '@/components/admin/analytics/FunnelAnalyticsBar';
import VisitorCountGraph from '@/components/admin/analytics/VisitorCountGraph';
import { getImageUrl } from '@/lib/artwork';

async function Reports({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const query = await searchParams;

  const timeframe = (query.timeframe as string) || undefined;
  const year = (query.year as string) ? parseInt(query.year as string) : new Date().getFullYear();
  const month = (query.month as string) ? parseInt(query.month as string) : new Date().getMonth() + 1;

  console.log('Timeframe in Reports page:', timeframe);
  console.log('Year in Reports page:', year);
  console.log('Month in Reports page:', month);

  const productDemandService = new ProductDemandService(timeframe);
  const { artworks, popularityScores } = await productDemandService.getArtworksPopularityScores();

  const funnelAnalysisService = new FunnelAnalyticsService(timeframe);
  const funnelMetrics = await funnelAnalysisService.getFunnelMetrics();

  const { count, monthly, daily } = await funnelAnalysisService.getVisitorMetrics(year, month);

  return (
    <div className="px-8 py-6">
      {/* Header */}
      <Header title="Reports" />

      <div className="mt-8 space-y-12">
        {/* Funnel Analysis */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Funnel Analysis</h2>
          <FunnelAnalyticsBar data={funnelMetrics} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Visitors</h2>
          <VisitorCountGraph
            year={year}
            month={month}
            totalVisitors={count.total}
            registeredVisitors={count.registered}
            guestVisitors={count.guests}
            monthly={monthly}
            daily={daily}
          />
        </section>

        {/* Product Demand */}
        <section>
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Artwork Demand Reports</h1>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Artwork Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      View Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wishlist Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cart Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rented Count
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {artworks.map((artwork, index) => {
                    const scores = popularityScores[artwork.id];
                    return (
                      <tr key={artwork.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative h-16 w-16">
                            <img
                              src={getImageUrl(artwork) || '/placeholder.png'}
                              alt={artwork.title || 'Artwork'}
                              className="object-cover rounded h-16 w-16"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{artwork.title || 'Untitled'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scores.viewCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scores.wishlistCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scores.cartCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scores.orderCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scores.rentedCount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Reports;
