'use client';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FunnelMetrics } from '@/types/analytics';
import { funnelStages } from '@/lib/labels';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface FunnelAnalyticsBarProps {
  data: FunnelMetrics;
}

export default function FunnelAnalyticsBar({ data }: FunnelAnalyticsBarProps) {
  const labels = funnelStages.map((label) => label.label);

  const countData = funnelStages.map((label) => data[label.value]?.count || 0);
  const conversionRates = funnelStages.map((label) => data[label.value]?.conversionRate || 0);
  const cumulativeConversionRates = funnelStages.map((label) => data[label.value]?.cumulativeConversionRate || 0);
  return (
    <>
      <Bar
        data={{
          labels: labels,
          datasets: [
            {
              label: 'Count',
              data: countData,
            },
          ],
        }}
      />
      <Bar
        data={{
          labels: labels,
          datasets: [
            {
              label: 'Conversion Rate (%)',
              data: conversionRates,
            },
            {
              label: 'Cumulative Conversion Rate (%)',
              data: cumulativeConversionRates,
            },
          ],
        }}
      />
    </>
  );
}
