'use client';
'use client';
import React, { useState, useEffect } from 'react';
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
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type VisitorCountGraphProps = {
  year: number;
  month: number;
  totalVisitors: number;
  registeredVisitors: number;
  guestVisitors: number;
  monthly: {
    labels: string[];
    data: number[];
  };
  daily: {
    labels: string[];
    data: number[];
  };
};

export default function VisitorCountGraph({
  year,
  month,
  customers,
  admins,
  guests,
  monthly,
  daily,
}: VisitorCountGraphProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentYear, setYear] = useState<number>(year);
  const [currentMonth, setMonth] = useState<number>(month);

  const handleSelectYear = (value: number) => {
    setYear(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set('year', value.toString());
    const monthsOfYear = monthOptions(value);
    if (!monthsOfYear.find((m) => m.value === currentMonth)) {
      const firstMonth = monthsOfYear[0].value;
      setMonth(firstMonth);
      params.set('month', firstMonth.toString());
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSelectMonth = (value: number) => {
    setMonth(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set('month', value.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const monthOptionList = monthOptions(currentYear);
  const yearOptionsList = yearsOptions(2025);

  const total = guests + customers;

  const labels = ['Guests', 'Customers'];
  const data = {
    labels,
    datasets: [
      {
        label: 'Visitors',
        data: [guests, customers, admins],
        backgroundColor: ['#22C55E', '#4F46E5'],
        borderColor: ['#16A34A', '#4338CA'],
        borderWidth: 1,
      },
    ],
  };

  const monthlyChartData = {
    labels: monthly.labels,
    datasets: [
      {
        label: 'Monthly Visitors',
        data: monthly.data,
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const dailyChartData = {
    labels: daily.labels,
    datasets: [
      {
        label: 'Daily Visitors',
        data: daily.data,
        borderColor: '#22C55E',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-2 text-sm text-gray-600">Total Visitors: {total}</div>
        <Pie data={data} options={options} />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold mb-4">Visitors Per Month ({year})</h3>
          <div>
            <select
              value={currentYear}
              onChange={(e) => handleSelectYear(parseInt(e.target.value))}
              className="px-3 py-2 rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-700"
            >
              {yearOptionsList.map((yr) => (
                <option key={yr.value} value={yr.value}>
                  {yr.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <Line data={monthlyChartData} options={options} />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold mb-4">
            Visitors Per Day ({fmtMonth(month)} - {year})
          </h3>
          <div>
            <select
              value={currentMonth}
              onChange={(e) => handleSelectMonth(parseInt(e.target.value))}
              className="px-3 py-2 rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-700"
            >
              {monthOptionList.map((mo) => (
                <option key={mo.value} value={mo.value}>
                  {mo.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <Line data={dailyChartData} options={options} />
        </div>
      </div>
    </div>
  );
}
