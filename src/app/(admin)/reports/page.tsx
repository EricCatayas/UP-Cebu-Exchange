import React from 'react';
import AnalyticsCard from '@/components/AnalyticsCard/AnalyticsCard';
import ArtworkPopularityMetricsCarousel from '@/components/admin/analytics/ArtworkPopularityMetricsCarousel';
import ArtworkPopularityMetricsTable from '@/components/admin/analytics/ArtworkPopularityMetricsTable';
import Header from '@/components/admin/Header';
import ToggleSession from '@/components/admin/analytics/ToggleSession';
import FunnelAnalyticsService from '@/services/FunnelAnalyticsService';
import Pagination from '@/components/Pagination/Pagination';
import ProductDemandService from '@/services/ProductDemandService';
import FunnelAnalyticsBar from '@/components/admin/analytics/FunnelAnalyticsBar';
import UserAnalyticsService from '@/services/UserAnalyticsService';
import VisitorCountGraph from '@/components/admin/analytics/VisitorCountGraph';
import { recentTimeframe } from '@/lib/labels';

async function Reports({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const query = await searchParams;

  const timeframe = (query.timeframe as string) || undefined;
  const year = (query.year as string) ? parseInt(query.year as string) : new Date().getFullYear();
  const month = (query.month as string) ? parseInt(query.month as string) : new Date().getMonth() + 1;
  const uniqueSession = (query.session as string) === 'unique' ? true : false;
  const page = (query.page as string) ? parseInt(query.page as string) : 1;
  const sort = (query.sort as string) || undefined;

  console.log('Timeframe in Reports page:', timeframe);
  console.log('Year in Reports page:', year);
  console.log('Month in Reports page:', month);

  const productDemandService = new ProductDemandService(timeframe);
  const { pageSize, nextPage, previousPage, totalPages, artworks, artworksWithScore, popularityScores } =
    await productDemandService.getArtworksPopularityScores({ page, limit: 10, sort: 'popular' });

  const topArtworks = artworksWithScore.slice(0, Math.min(artworksWithScore.length, 10));

  const funnelAnalysisService = new FunnelAnalyticsService(timeframe);
  const funnelMetrics = await funnelAnalysisService.getFunnelMetrics({ unique: uniqueSession });

  console.log('Funnel Metrics in Reports page:', funnelMetrics);

  const userAnalyticsService = new UserAnalyticsService(timeframe);
  const { count, monthly, daily } = await userAnalyticsService.getVisitorMetrics(year, month, uniqueSession);
  return (
    <div className="px-8 py-6">
      {/* Header */}
      <Header title="Reports">
        <ToggleSession />
      </Header>

      <div className="mt-8 space-y-8">
        {/* Funnel Analysis */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Funnel Analysis</h2>
          <FunnelAnalyticsBar data={funnelMetrics} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Visitors</h2>
          <p className="text-sm text-gray-500">Track your visitor metrics and trends.</p>
          <VisitorCountGraph
            year={year}
            month={month}
            customers={count.customers}
            guests={count.guests}
            monthly={monthly}
            daily={daily}
          />
        </section>
        <section className="flex items-start gap-6">
          <div className="w-28 text-gray-700 font-medium pt-2">Visitors</div>
          <div className="flex flex-wrap gap-6">
            <AnalyticsCard header="Guests" value={count.guests} />
            <AnalyticsCard header="Customers" value={count.customers} />
            <AnalyticsCard header="Recently Registered" value={count.newCustomers} subheader={recentTimeframe.label} />
            <AnalyticsCard header="Returning Customers" value={count.returningCustomers} />
          </div>
        </section>

        {/* Product Demand */}
        <section>
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Artwork Demand Reports</h1>
            <h2 className="text-2xl font-semibold mb-4">Top Artworks</h2>
            <ArtworkPopularityMetricsCarousel artworks={topArtworks} popularityScores={popularityScores} />
            <h2 className="text-2xl font-semibold mb-4">All Artworks</h2>
            <ArtworkPopularityMetricsTable artworks={artworks} popularityScores={popularityScores} />
            <Pagination page={page} totalPages={totalPages} nextPage={nextPage} previousPage={previousPage} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Reports;
