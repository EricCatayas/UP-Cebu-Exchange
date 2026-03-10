'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getImageUrl, getDimension } from '@/lib/artwork';
import { ArtworkDTO } from '@/models/Artwork';

interface ArtistCreateFormProps {
  artworks: ArtworkDTO[];
}

export default function ArtistCreateForm({ artworks }: ArtistCreateFormProps) {
  const [name, setName] = useState('');
  const [biography, setBiography] = useState('');
  const [selectedArtworks, setSelectedArtworks] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const handleSelectArtwork = (artworkId: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedArtworks((prev) => [...prev, artworkId]);
    } else {
      setSelectedArtworks((prev) => prev.filter((id) => id !== artworkId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/artists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, biography, artworkIds: selectedArtworks }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update artist');
      }

      setMessage({ type: 'success', text: 'Artist updated successfully!' });
      setTimeout(() => {
        router.push('/admin/artists');
      }, 1500);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create Artist</h2>

      {message && (
        <div
          className={`mb-6 p-4 rounded-md ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Artist Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter artist name"
            required
            disabled={isLoading}
          />
        </div>

        {/* Biography Field */}
        <div>
          <label htmlFor="biography" className="block text-sm font-medium text-gray-700 mb-2">
            Biography
          </label>
          <textarea
            id="biography"
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            placeholder="Enter artist biography"
            rows={6}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {name ? `Artworks by ${name}` : 'Artworks by the artist'}
          </label>
          {artworks.length > 0 ? (
            <div className="max-h-60 overflow-y-auto">
              {artworks.map((artwork) => (
                <div
                  key={artwork.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <input
                      type="checkbox"
                      id={`artwork-${artwork.id}`}
                      checked={selectedArtworks.includes(artwork.id)}
                      onChange={handleSelectArtwork(artwork.id)}
                      className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                    />
                    <div className="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0">
                      {artwork.images && artwork.images.length > 0 ? (
                        <img
                          src={getImageUrl(artwork)}
                          alt={artwork.title}
                          className="w-full h-full object-cover rounded-md cursor-pointer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs cursor-pointer">
                          Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 cursor-pointer">
                      <h3 className="font-semibold">{artwork.title}</h3>
                      <p className="text-sm text-gray-600">{getDimension(artwork)}</p>
                    </div>

                    <label htmlFor={`artwork-${artwork.id}`} className="ml-2 block text-sm text-gray-700">
                      {artwork.title}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No artworks available for association.</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Loading...' : 'Create Artist'}
          </button>
        </div>
      </form>
    </div>
  );
}
