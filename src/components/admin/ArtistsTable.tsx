'use client';

import { useState } from 'react';
import { ArtistDTO } from '@/models/Artist';
import { ArtworkDTO } from '@/models/Artwork';
import { getImageUrl } from '@/lib/artwork';
import Link from 'next/link';

export default function ArtistsTable({ artists }: { artists: ArtistDTO[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpanded = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!artists || artists.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No artists found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artworks</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {artists.map((artist) => (
            <>
              <tr key={artist.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{artist.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {artist.artworks ? artist.artworks.length : 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/admin/artists/${artist.id}`}
                    className="text-sm px-3 py-1 bg-green-50 text-green-600 hover:bg-green-100 rounded transition-colors font-medium"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => toggleExpanded(artist.id)}
                    className="text-sm px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors font-medium"
                  >
                    {expandedId === artist.id ? 'Hide Artworks' : 'Show Artworks'}
                  </button>
                </td>
              </tr>
              {expandedId === artist.id && (
                <tr className="bg-gray-50">
                  <td colSpan={4} className="px-6 py-4">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 text-sm mb-2">Artworks by {artist.name}</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thumbnail
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {artist.artworks && artist.artworks.length > 0 ? (
                              artist.artworks.map((artwork) => (
                                <tr key={artwork.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-2 whitespace-nowrap">
                                    <div className="relative h-12 w-12">
                                      <img
                                        src={getImageUrl(artwork)}
                                        alt={artwork.title || 'Artwork'}
                                        className="object-cover rounded h-12 w-12"
                                      />
                                    </div>
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-900">{artwork.title || 'Untitled'}</td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                    {artwork.status}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap">
                                    <Link
                                      href={`/admin/inventory/${artwork.id}`}
                                      className="text-sm px-3 py-1 bg-green-50 text-green-600 hover:bg-green-100 rounded transition-colors font-medium"
                                    >
                                      View
                                    </Link>
                                    <Link
                                      href={`/admin/inventory/${artwork.id}/edit`}
                                      className="ml-2 text-sm px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors font-medium"
                                    >
                                      Edit
                                    </Link>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                                  No artworks found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
