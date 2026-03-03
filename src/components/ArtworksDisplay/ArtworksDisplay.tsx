'use client';

import ArtworkCard from '@/components/ArtworkCard/ArtworkCard';
import { ArtworkDTO } from '@/models/Artwork';
import { useEffect, useRef, useState } from 'react';
import '../ArtworkCarousel/ArtworkCarousel.css';

export default function ArtworksDisplay({ artworks }: { artworks: ArtworkDTO[] }) {
  const [positions, setPositions] = useState<Array<{ left: number; top: number; right: number }>>([]);
  const [maxHeight, setMaxHeight] = useState(450);

  const carouselRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [index, setIndex] = useState(0);

  const checkScrollability = () => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    const generatePositions = () => {
      const minGap = 25;
      const maxGap = 45;
      const minTop = 5;
      const maxTop = 30; // pixels of vertical offset

      const newPositions: Array<{ left: number; top: number; right: number }> = [];

      artworks.forEach((_, index) => {
        // Random vertical offset
        const top = index === 0 ? Math.random() * (10 - minTop) + minTop : Math.random() * (maxTop - minTop) + minTop;

        // Random gap to next card
        const gap = Math.random() * (maxGap - minGap) + minGap;

        newPositions.push({
          left: index === 0 ? 0 : gap,
          right: index === artworks.length - 1 ? 0 : gap,
          top: top,
        });

        setMaxHeight(Math.max(maxHeight, top + 500)); // assuming card height ~500px
      });

      setPositions(newPositions);
    };

    generatePositions();

    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [artworks]);

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;

    // Get actual width of current carousel item
    const currentItemRef = itemRefs.current[index];
    const cardWidth = currentItemRef?.offsetWidth || 300;
    const cardMargin = positions[index]?.left || positions[index]?.right || 0;
    const scrollAmount = cardWidth + cardMargin;

    const newScrollLeft =
      direction === 'left'
        ? carouselRef.current.scrollLeft - scrollAmount
        : carouselRef.current.scrollLeft + scrollAmount;

    carouselRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });

    setIndex((prev) => {
      const newIndex = direction === 'left' ? prev - 1 : prev + 1;
      return Math.max(0, Math.min(artworks.length - 1, newIndex));
    });

    setTimeout(checkScrollability, 300);
  };
  return (
    <div className="artwork-carousel-container">
      <div className="carousel-wrapper">
        <div ref={carouselRef} className="carousel-content" style={{ gap: '0px' }} onScroll={checkScrollability}>
          {artworks.map((a, idx) => (
            <div
              key={a.id}
              ref={(el) => {
                if (el) itemRefs.current[idx] = el;
              }}
              className="carousel-item"
              style={{
                marginRight: `${positions[idx]?.right || 0}px`,
                marginTop: `${positions[idx]?.top || 0}px`,
                transition: 'all 0.3s ease-out',
              }}
            >
              <ArtworkCard artwork={a} displayInfo={false} />
            </div>
          ))}
        </div>
        {canScrollLeft && (
          <button type="button" onClick={() => scroll('left')} aria-label="Previous artworks">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        {canScrollRight && (
          <button type="button" onClick={() => scroll('right')} aria-label="Next artworks">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
