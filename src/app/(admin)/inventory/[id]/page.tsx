import React from 'react';
import Link from 'next/link';
import AnalyticsCard from '@/components/AnalyticsCard/AnalyticsCard';
import ArtworkService from '@/services/ArtworkService';
import RentalOrderService from '@/services/RentalOrderService';
import ProductDemandService from '@/services/ProductDemandService';
import { FaEye, FaEdit } from 'react-icons/fa';
import { ArtworkDTO } from '@/models/Artwork';
import { ARTWORK_STATUS } from '@/lib/constants';
import { notFound } from 'next/navigation';
import { fmtMoney } from '@/lib/formatter';

async function InventoryDetails({ params }: { params: { id: string } }) {
  const id = parseInt((await params).id);
  const artworkService = new ArtworkService();
  const artwork = await artworkService.getArtworkById(id);

  if (!artwork) {
    return notFound();
  }

  const productDemandService = new ProductDemandService();

  const [viewCount, rentedCount, wishlistCount, shoppingCartCount] = await Promise.all([
    productDemandService.getArtworkViewCount(artwork.id),
    productDemandService.getArtworkRentedCount(artwork.id),
    productDemandService.getArtworkWishlistCount(artwork.id),
    productDemandService.getArtworkCartCount(artwork.id),
  ]);

  const isCurrentlyRented = artwork.status === ARTWORK_STATUS.RENTED;
  let ongoingRentalOrderId: number | null = null;

  if (isCurrentlyRented) {
    const rentalOrderService = new RentalOrderService();
    const ongoingOrder = await rentalOrderService.getOngoingRentalByArtworkId(artwork.id);
    ongoingRentalOrderId = ongoingOrder ? ongoingOrder.id : null;
  }

  return (
    <div className="px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{artwork.title || 'Untitled Artwork'}</h1>
        <span className="flex gap-4">
          {isCurrentlyRented && (
            // Link to ongoing rental order details
            <Link
              href={`/orders/${ongoingRentalOrderId}`}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              <FaEdit /> View Ongoing Rental
            </Link>
          )}
          <Link
            href={`/artworks/${artwork.id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            <FaEye /> Live View
          </Link>
          <Link
            href={`/inventory/${artwork.id}/edit`}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            <FaEdit /> Edit Artwork
          </Link>
        </span>
      </div>

      <div className="mt-8 space-y-12">
        {/* Popularity Analytics */}
        <section className="flex items-start gap-6">
          <div className="flex flex-wrap gap-6">
            <div className="w-28 text-gray-700 font-medium pt-2">Popularity</div>
            <AnalyticsCard header="Views" value={viewCount} />
            <AnalyticsCard header="Rented" value={rentedCount} />
            <AnalyticsCard header="In Wishlists" value={wishlistCount} />
            <AnalyticsCard header="In Shopping Carts" value={shoppingCartCount} />
          </div>
        </section>

        {/* Artwork Details */}
        <section className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Images */}
          {artwork.images && artwork.images.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Images</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {artwork.images.map((image, index) => (
                  <div key={image.id} className="relative">
                    <img
                      src={image.imageUrl}
                      alt={`${artwork.title} - Image ${index + 1}`}
                      className="w-full object-cover rounded-md border border-gray-300"
                    />
                    {image.isPrimary && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <p className="text-gray-900">{artwork.title || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    artwork.status === 'Available'
                      ? 'bg-green-100 text-green-800'
                      : artwork.status === 'Rented'
                        ? 'bg-blue-100 text-blue-800'
                        : artwork.status === 'Maintenance'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                  }`}
                >
                  {artwork.status}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
                <p className="text-gray-900">{artwork.artist?.name || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                <p className="text-gray-900">{artwork.style?.name || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medium</label>
                <p className="text-gray-900">{artwork.medium || 'N/A'}</p>
              </div>
            </div>

            {artwork.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-gray-900 whitespace-pre-wrap">{artwork.description}</p>
              </div>
            )}
          </div>

          {/* Dimensions */}
          <div className="space-y-4 pt-6">
            <h2 className="text-xl font-semibold">Dimensions</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                <p className="text-gray-900">{artwork.heightCm ? `${artwork.heightCm} cm` : 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                <p className="text-gray-900">{artwork.widthCm ? `${artwork.widthCm} cm` : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Rental Plans */}
          {artwork.rentalPlans && artwork.rentalPlans.length > 0 && (
            <div className="space-y-4 pt-6">
              <h2 className="text-xl font-semibold">Rental Plans</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {artwork.rentalPlans.map((plan) => (
                  <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">{plan.durationMonths} Months</p>
                    <p className="text-2xl font-bold text-gray-900">{fmtMoney(plan.price)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {artwork.tags && artwork.tags.length > 0 && (
            <div className="space-y-4 pt-6">
              <h2 className="text-xl font-semibold">Tags</h2>

              <div className="flex flex-wrap gap-2">
                {artwork.tags.map((tag) => (
                  <span key={tag.id} className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="space-y-4 pt-6">
            <h2 className="text-xl font-semibold">Metadata</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                <p className="text-gray-900">{new Date(artwork.createdAt).toLocaleString()}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Updated At</label>
                <p className="text-gray-900">{new Date(artwork.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default InventoryDetails;
