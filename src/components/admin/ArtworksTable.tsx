'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useModal } from '@/contexts/ModalContext';
import { getImageUrl } from '@/lib/artwork';
import { ARTWORK_STATUS, ARTWORK_STATUSES } from '@/lib/constants';
import { artworkApi } from '@/lib/api/artwork';
import { FaSearch, FaEdit, FaTrash, FaPaintBrush, FaEye } from 'react-icons/fa';

export default function ArtworksTable({ artworks: data }: { artworks: any[] }) {
  const [artworks, setArtworks] = useState(data);
  const { openConfirmation } = useModal();

  useEffect(() => {
    setArtworks(data);
  }, [data]);

  const handleStatusChange = async (artworkId: number, newStatus: string, prevStatus: string) => {
    try {
      await artworkApi.updateStatus(artworkId, newStatus);
      alert('Artwork status updated successfully.');
    } catch (error) {
      alert(error.message);
      setArtworks((prev) =>
        prev.map((artwork) => (artwork.id === artworkId ? { ...artwork, status: prevStatus } : artwork))
      );
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
                  onChange={(e) => handleStatusChange(artwork.id, e.target.value, artwork.status)}
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
                <div className="relative group">
                  <button className="text-xl text-gray-600 hover:text-gray-800 px-2 py-1">...</button>
                  <div className="absolute right-0 w-48 bg-white border border-gray-200 rounded shadow-lg hidden group-hover:block z-10">
                    <Link
                      href={`/admin/inventory/${artwork.id}`}
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-50 text-sm flex items-center gap-2"
                    >
                      <FaSearch /> View
                    </Link>
                    <Link
                      href={`/artworks/${artwork.id}`}
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-50 text-sm flex items-center gap-2"
                    >
                      <FaEye /> Public View
                    </Link>
                    <Link
                      href={`/admin/inventory/${artwork.id}/edit`}
                      className="block px-4 py-2 text-blue-600 hover:bg-gray-50 text-sm flex items-center gap-2"
                    >
                      <FaEdit /> Edit
                    </Link>
                    <Link
                      href={`/admin/artists/${artwork.artistId}?prev=inventory`}
                      className="block px-4 py-2 text-green-600 hover:bg-gray-50 text-sm flex items-center gap-2"
                    >
                      <FaPaintBrush /> Artist
                    </Link>
                    <button
                      onClick={() => handleDelete(artwork.id)}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 text-sm flex items-center gap-2"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
