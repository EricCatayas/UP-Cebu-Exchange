'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { StyleDTO } from '@/models/Style';

export default function ArtworksFilterBar({ mediums, styles }: { mediums: string[]; styles: StyleDTO[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '');
  const [selectedStyleIds, setSelectedStyleIds] = useState<number[]>(
    searchParams.get('styles')?.split(',').map(Number).filter(Boolean) || []
  );
  const [selectedMediums, setSelectedMediums] = useState<string[]>(
    searchParams.get('mediums')?.split(',').filter(Boolean) || []
  );

  const hasFilter = searchParams.toString().length > 0 && !searchParams.toString().includes('page=');

  enum SORTBY {
    POPULAR = 'popular',
    LATEST = 'latest',
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleToggleStyle = (styleId: number) => {
    setSelectedStyleIds((prevSelected) => {
      if (prevSelected.includes(styleId)) {
        return prevSelected.filter((id) => id !== styleId);
      }
      return [...prevSelected, styleId];
    });
  };

  const handleToggleMedium = (medium: string) => {
    setSelectedMediums((prevSelected) => {
      if (prevSelected.includes(medium)) {
        return prevSelected.filter((m) => m !== medium);
      }
      return [...prevSelected, medium];
    });
  };

  const handleApplyFilter = () => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }

    if (sortBy) {
      params.set('sort', sortBy);
    }

    if (selectedStyleIds.length > 0) {
      params.set('styles', selectedStyleIds.join(','));
    }

    if (selectedMediums.length > 0) {
      params.set('mediums', selectedMediums.join(','));
    }

    // Update URL with new parameters
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleRemoveFilter = () => {
    setSearchQuery('');
    setSortBy('');
    setSelectedStyleIds([]);
    setSelectedMediums([]);
    router.push('/artworks', { scroll: false });
  };

  return (
    <>
      <details className="group p-4">
        <summary className="flex justify-between items-center cursor-pointer list-none">
          <div className="flex items-center gap-4 flex-wrap flex-1">
            <input
              type="text"
              placeholder="Search by artwork, artist, or style"
              value={searchQuery}
              onChange={handleSearchChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">SORT BY:</label>
              <button
                onClick={() => setSortBy(SORTBY.POPULAR)}
                className={`px-3 py-2 text-sm rounded-md transition ${
                  sortBy === SORTBY.POPULAR ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Popular
              </button>
              <button
                onClick={() => setSortBy(SORTBY.LATEST)}
                className={`px-3 py-2 text-sm rounded-md transition ${
                  sortBy === SORTBY.LATEST ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Latest
              </button>
            </div>
            <button
              onClick={handleApplyFilter}
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark transition"
            >
              Apply Filter
            </button>
            {hasFilter && (
              <button
                onClick={handleRemoveFilter}
                className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition"
              >
                Remove Filter
              </button>
            )}
          </div>
          <svg
            className="w-5 h-5 ml-4 transition-transform group-open:rotate-180 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Styles</h3>
            <div className="flex flex-wrap gap-2">
              {styles?.map((style) => (
                <label
                  key={style.id}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedStyleIds.includes(style.id)}
                    onChange={() => handleToggleStyle(style.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{style.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Mediums</h3>
            <div className="flex flex-wrap gap-2">
              {mediums?.map((medium) => (
                <label
                  key={medium}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedMediums.includes(medium)}
                    onChange={() => handleToggleMedium(medium)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{medium}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </details>
    </>
  );
}
