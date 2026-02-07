'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Line, Pie } from 'react-chartjs-2';
import { fmtMonth } from '@/lib/formatter';
import { monthOptions, yearsOptions } from '@/lib/labels';

import {
  ArcElement,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, // Added for nice area shading
  scales,
} from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

type VisitorCountGraphProps = {
  year: number;
  month: number;
  customers: number;
  guests: number;
  monthly: { labels: string[]; data: number[] };
  daily: { labels: string[]; data: number[] };
};

export default function VisitorCountGraph({ year, month, customers, guests, monthly, daily }: VisitorCountGraphProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentYear, setYear] = useState<number>(year);
  const [currentMonth, setMonth] = useState<number>(month);
  const [viewMode, setViewMode] = useState<'monthly' | 'daily'>('monthly');

  const handleSelectYear = (value: number) => {
    setYear(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set('year', value.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleToggleViewMode = () => {
    setViewMode((prev) => (prev === 'monthly' ? 'daily' : 'monthly'));
  };

  const handleSelectMonth = (value: number) => {
    setMonth(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set('month', value.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const, labels: { boxWidth: 10, font: { size: 11 } } },
    },
  };

  const lineOptions = {
    ...commonOptions,
    scales: {
      y: { beginAtZero: true, ticks: { font: { size: 10 } } },
      x: { ticks: { font: { size: 10 } } },
    },
  };

  return (
    <div>
      {/* Header Info */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Analytics Overview</h2>
        <p className="text-sm text-gray-500">Track your visitor metrics and trends.</p>
      </div>

      {/* Top Row: Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Pie Chart Card - Takes 1 column */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold text-gray-600 mb-4 self-start">Visitor Type</h3>
          <div className="h-60 w-full">
            <Pie
              options={commonOptions}
              data={{
                labels: ['Guests', 'Customers'],
                datasets: [
                  {
                    data: [guests, customers],
                    backgroundColor: ['#22C55E', '#4F46E5'],
                    hoverOffset: 4,
                  },
                ],
              }}
            />
          </div>
          <div className="mt-4 text-center">
            <span className="text-2xl font-bold text-gray-800">{guests + customers}</span>
            <p className="text-xs text-gray-400 uppercase">Total Visitors</p>
          </div>
        </div>

        {/* Monthly Line Chart Card - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold text-gray-600">
              {viewMode === 'monthly' ? 'Monthly Activity' : 'Daily Activity'}
            </h3>
            <div className="flex items-center gap-2">
              {viewMode === 'daily' && (
                <select
                  value={currentMonth}
                  onChange={(e) => handleSelectMonth(parseInt(e.target.value))}
                  className="text-xs border-gray-200 rounded-lg focus:ring-indigo-500"
                >
                  {monthOptions(currentYear).map((mo) => (
                    <option key={mo.value} value={mo.value}>
                      {mo.label}
                    </option>
                  ))}
                </select>
              )}
              <select
                value={currentYear}
                onChange={(e) => handleSelectYear(parseInt(e.target.value))}
                className="text-xs border-gray-200 rounded-lg focus:ring-indigo-500"
              >
                {yearsOptions(2025).map((yr) => (
                  <option key={yr.value} value={yr.value}>
                    {yr.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="h-64">
            {viewMode === 'monthly' ? (
              <Line
                options={lineOptions}
                data={{
                  labels: monthly.labels,
                  datasets: [
                    {
                      label: 'Monthly Visitors',
                      data: monthly.data,
                      borderColor: '#4F46E5',
                      backgroundColor: 'rgba(79, 70, 229, 0.05)',
                      fill: true,
                      tension: 0.4,
                    },
                  ],
                }}
              />
            ) : (
              <Line
                options={{
                  ...lineOptions,
                  scales: {
                    y: { beginAtZero: true, ticks: { font: { size: 10 } } },
                    x: { ticks: { font: { size: 10 } } },
                  },
                }}
                data={{
                  labels: daily.labels,
                  datasets: [
                    {
                      label: 'Daily Visitors',
                      data: daily.data,
                      borderColor: '#22C55E',
                      backgroundColor: 'rgba(34, 197, 94, 0.05)',
                      fill: true,
                      tension: 0.3,
                    },
                  ],
                }}
              />
            )}
            <button onClick={handleToggleViewMode} className="mt-4 text-xs text-indigo-600 hover:underline">
              {viewMode === 'monthly' ? 'View Daily' : 'View Monthly'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
