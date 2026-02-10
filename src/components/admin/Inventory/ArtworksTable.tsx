'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { useModal } from '@/contexts/ModalContext';
import { getImageUrl } from '@/lib/artwork';
import { ARTWORK_STATUS, ARTWORK_STATUSES } from '@/lib/constants';
import { artworkApi } from '@/lib/api/artwork';
import { FaSearch, FaInfoCircle, FaEdit, FaTrash } from 'react-icons/fa';

export default function ArtworksTable({ artworks: data }: { artworks: any[] }) {
  const [artworks, setArtworks] = useState(data);
  const { openConfirmation } = useModal();

  const handleStatusChange = async (artworkId: number, newStatus: string) => {
    try {
      await artworkApi.updateStatus(artworkId, newStatus);
    } catch (error) {
      alert(error.message);
      // Optionally, you can add an error notification
    }
  };

  const handleDelete = async (artworkId: number) => {
    openConfirmation(
      {
        title: 'Delete Artwork',
        message: 'Are you sure you want to delete this artwork?',
      },
      async () => {
        try {
          await artworkApi.delete(artworkId);
          alert('Artwork deleted successfully.');
          setArtworks(artworks.filter((artwork) => artwork.id !== artworkId));
        } catch (error) {
          alert(error.message);
        }
      },
      () => {}
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thumbnail
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {artworks.map((artwork) => (
            <tr key={artwork.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{artwork.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="relative h-16 w-16">
                  <img
                    src={getImageUrl(artwork) || '/images/placeholder.png'}
                    alt={artwork.title || 'Artwork'}
                    className="object-cover rounded h-16 w-16"
                  />
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{artwork.title || 'Untitled'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  defaultValue={artwork.status}
                  onChange={(e) => handleStatusChange(artwork.id, e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ARTWORK_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex gap-2">
                  <Link
                    href={`/admin/inventory/${artwork.id}`}
                    className="text-gray-600 hover:text-gray-800 font-medium"
                  >
                    <FaSearch />
                  </Link>
                  <Link
                    href={`/admin/inventory/${artwork.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    onClick={() => handleDelete(artwork.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
