'use client';
import React, { useRef, useState } from 'react';
import ArtworkCard from '@/components/ArtworkCard/ArtworkCard';
import './ArtworkCarousel.css';

interface ArtworkCarouselProps {
  artworks: any[];
}

export default function ArtworkCarousel({ artworks }: ArtworkCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;

    const scrollAmount = carouselRef.current.clientWidth;
    const newScrollLeft =
      direction === 'left'
        ? carouselRef.current.scrollLeft - scrollAmount
        : carouselRef.current.scrollLeft + scrollAmount;

    carouselRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });

    setTimeout(checkScrollability, 300);
  };

  React.useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [artworks]);

  if (!artworks || artworks.length === 0) {
    return null;
  }

  return (
    <div className="artwork-carousel-container">
      <div className="carousel-wrapper">
        {/* Previous Button */}
        {canScrollLeft && (
          <button
            type="button"
            className="carousel-btn carousel-btn-prev"
            onClick={() => scroll('left')}
            aria-label="Previous artworks"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        {/* Carousel Content */}
        <div
          ref={carouselRef}
          className="carousel-content"
          onScroll={checkScrollability}
        >
          {artworks.map((artwork) => (
            <div key={artwork.id} className="carousel-item">
              <ArtworkCard artwork={artwork} />
            </div>
          ))}
        </div>

        {/* Next Button */}
        {canScrollRight && (
          <button
            type="button"
            className="carousel-btn carousel-btn-next"
            onClick={() => scroll('right')}
            aria-label="Next artworks"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
