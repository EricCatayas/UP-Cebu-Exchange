'use client';
import React, { useEffect, useRef, useState } from 'react';
import { funnelStages } from '@/lib/labels';
import type { MilestoneMetrics } from '@/types/analytics';
import { FaCheckCircle, FaCircle } from 'react-icons/fa';
import { fmtDate } from '@/lib/formatter';

interface UserMilestonesProps {
  milestones: MilestoneMetrics;
}

function UserMilestones({ milestones }: UserMilestonesProps) {
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

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [milestones]);

  return (
    <div className="bg-white p-6 relative">
      {canScrollLeft && (
        <button
          type="button"
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 shadow p-2 hover:bg-white"
          onClick={() => scroll('left')}
          aria-label="Scroll milestones left"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}
      <div
        ref={carouselRef}
        className="flex items-start justify-between gap-2 overflow-x-auto pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        onScroll={checkScrollability}
      >
        {funnelStages.map((stage, index) => {
          const hasReached = milestones[stage.value]?.hasReached || false;
          const reachedAt = milestones[stage.value]?.reachedAt;
          const isLast = index === funnelStages.length - 1;

          return (
            <div key={stage.value} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center gap-2 min-w-[80px]">
                {hasReached ? (
                  <FaCheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <FaCircle className="w-8 h-8 text-gray-300" />
                )}
                <div className="text-center">
                  <p className={`text-xs font-medium ${hasReached ? 'text-gray-900' : 'text-gray-400'}`}>
                    {stage.label}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1">{hasReached ? 'Completed' : 'Not reached'}</p>
                  {reachedAt && <p className="text-[10px] text-gray-400 mt-1">{fmtDate(reachedAt)}</p>}
                </div>
              </div>
              {!isLast && <div className={`h-0.5 w-8 mx-1 ${hasReached ? 'bg-green-600' : 'bg-gray-200'}`} />}
            </div>
          );
        })}
      </div>
      {canScrollRight && (
        <button
          type="button"
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 shadow p-2 hover:bg-white"
          onClick={() => scroll('right')}
          aria-label="Scroll milestones right"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default UserMilestones;
