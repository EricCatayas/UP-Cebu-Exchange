'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { timeframes, timeframeDefault } from '@/lib/labels';

export default function Header({ title, children }: { title: string; children?: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [timeframe, setTimeframe] = useState(searchParams.get('timeframe') || timeframeDefault);

  const handleSelectTimeframe = (value: string) => {
    setTimeframe(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('timeframe', value);
    } else {
      params.delete('timeframe');
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="flex items-center gap-4">
        {children}
        <div>
          <select
            value={timeframe}
            onChange={(e) => handleSelectTimeframe(e.target.value)}
            className="px-3 py-2 rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-700"
          >
            {timeframes.map((tf) => (
              <option key={tf.value} value={tf.value}>
                {tf.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
