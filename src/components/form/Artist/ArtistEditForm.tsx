'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/contexts/ModalContext';

interface Artist {
  id: number;
  name: string;
  biography: string;
}

interface ArtistDetailsFormProps {
  artist: Artist;
}

export default function ArtistEditForm({ artist }: ArtistDetailsFormProps) {
  const [name, setName] = useState(artist.name);
  const [biography, setBiography] = useState(artist.biography);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();
  const { openConfirmation } = useModal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/artists/${artist.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, biography }),
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

  const handleDelete = () => {
    openConfirmation(
      {
        title: 'Delete Artist',
        message: 'Are you sure you want to delete this artist? This action cannot be undone.',
      },
      async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/artists/${artist.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete artist');
          }

          setMessage({ type: 'success', text: 'Artist deleted successfully!' });
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
      },
      () => {
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Edit Artist</h2>

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

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Deleting...' : 'Delete Artist'}
          </button>
        </div>
      </form>
    </div>
  );
}
