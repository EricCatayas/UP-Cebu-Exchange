'use client';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
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

  // Shared elegant options
  const getOptions = (title: string, suffix: string = ''): ChartOptions<'bar'> => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: title.includes('Rates'), // Only show legend for the dual-bar chart
        position: 'top' as const,
        align: 'end' as const,
        labels: { usePointStyle: true, pointStyle: 'circle', font: { size: 11 } }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y}${suffix}`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, border: { display: false } },
      y: { 
        beginAtZero: true, 
        border: { display: false },
        grid: { color: '#94a3b8' },
        ticks: { callback: (val) => `${val}${suffix}` }
      }
    }
  });

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto p-4">
      {/* Chart 1: Visit Volume */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <header className="mb-6">
          <h3 className="text-lg font-bold text-slate-800">Visit Count</h3>
          <p className="text-sm text-slate-500">Total volume per funnel stage</p>
        </header>
        <div className="h-64">
          <Bar
            options={getOptions('Visit Count')}
            data={{
              labels,
              datasets: [{
                label: 'Visits',
                data: countData,
                backgroundColor: '#6366f1',
                borderRadius: 6,
                barThickness: 32,
              }],
            }}
          />
        </div>
      </div>

      {/* Chart 2: Conversion Efficiency */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <header className="mb-6">
          <h3 className="text-lg font-bold text-slate-800">Conversion Rates</h3>
          <p className="text-sm text-slate-500">Individual vs. Cumulative performance</p>
        </header>
        <div className="h-80">
          <Bar
            options={getOptions('Rates', '%')}
            data={{
              labels,
              datasets: [
                {
                  label: 'Stage Conversion',
                  data: conversionRates,
                  backgroundColor: '#10b981', // Emerald
                  borderRadius: 4,
                  categoryPercentage: 0.7,
                  barPercentage: 0.8,
                },
                {
                  label: 'Cumulative Conversion',
                  data: cumulativeConversionRates,
                  backgroundColor: '#94a3b8', // Subtle Slate
                  borderRadius: 4,
                  categoryPercentage: 0.7,
                  barPercentage: 0.8,
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
}