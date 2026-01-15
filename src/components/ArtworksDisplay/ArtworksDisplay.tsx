'use client';

import ArtworkCard from '@/components/ArtworkCard/ArtworkCard';
import { ArtworkDTO } from '@/models/Artwork';
import { useEffect, useState } from 'react';

export default function ArtworksDisplay({ artworks }: { artworks: ArtworkDTO[] }) {
  const [positions, setPositions] = useState<Array<{ left: number; top: number }>>([]);
  const [maxHeight, setMaxHeight] = useState(450);

  useEffect(() => {
    const generatePositions = () => {
      const cardWidth = 420; // 300px + some margin
      const minGap = 15;
      const maxGap = 50;
      const minTop = 0;
      const maxTop = 150; // pixels of vertical offset

      const newPositions: Array<{ left: number; top: number }> = [];
      let currentLeft = 0;

      artworks.forEach(() => {
        // Random vertical offset
        const top = Math.random() * (maxTop - minTop) + minTop;

        // Random gap to next card
        const gap = Math.random() * (maxGap - minGap) + minGap;

        newPositions.push({
          left: currentLeft,
          top: top,
        });

        currentLeft += cardWidth + gap;
        setMaxHeight(Math.max(maxHeight, top + 500)); // assuming card height ~500px
      });

      setPositions(newPositions);
    };

    generatePositions();
  }, [artworks.length]);

  // Calculate total width needed
  const totalWidth = positions.length > 0 ? positions[positions.length - 1]?.left + 320 : 0;

  return (
    <div className="relative w-full" style={{ height: `${maxHeight}px` }}>
      <div className="relative" style={{ width: `${totalWidth}px`, height: '100%' }}>
        {artworks.map((a, index) => (
          <div
            key={a.id}
            style={{
              position: 'absolute',
              left: `${positions[index]?.left || 0}px`,
              top: `${positions[index]?.top || 0}px`,
              width: '400px',
              transition: 'all 0.3s ease-out',
            }}
          >
            <ArtworkCard artwork={a} displayInfo={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
