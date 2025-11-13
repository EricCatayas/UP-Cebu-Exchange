'use client';
import React, { useState } from 'react';
import { MONTHS } from '@/lib/constants';
import './AnnualDateRange.css';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface AnnualDateRangeProps {
  dateRanges: DateRange[];
  initialYear?: number;
  onYearChange?: (year: number) => void;
}

export default function AnnualDateRange({
  dateRanges,
  initialYear = new Date().getFullYear(),
  onYearChange,
}: AnnualDateRangeProps) {
  const [currentYear, setCurrentYear] = useState(initialYear);

  const handlePreviousYear = () => {
    const newYear = currentYear - 1;
    setCurrentYear(newYear);
    onYearChange?.(newYear);
  };

  const handleNextYear = () => {
    const newYear = currentYear + 1;
    setCurrentYear(newYear);
    onYearChange?.(newYear);
  };

  const handleToday = () => {
    const today = new Date();
    const todayYear = today.getFullYear();
    setCurrentYear(todayYear);
    onYearChange?.(todayYear);
  };

  // Filter date ranges for the current year
  const yearRanges = dateRanges.filter((range) => {
    const startYear = range.startDate.getFullYear();
    const endYear = range.endDate.getFullYear();
    return startYear <= currentYear && endYear >= currentYear;
  });

  const getMonthCoverageInRange = (rangeIndex: number, monthIndex: number) => {
    const monthStart = new Date(currentYear, monthIndex, 1);
    const monthEnd = new Date(currentYear, monthIndex + 1, 0);

    const range = dateRanges[rangeIndex];
    const rangeStart = range.startDate;
    const rangeEnd = range.endDate;

    // Check if this month overlaps with the range
    if (rangeStart <= monthEnd && rangeEnd >= monthStart) {
      const totalDays = monthEnd.getDate();
      const startDay = rangeStart > monthStart ? rangeStart.getDate() : 1;
      const endDay = rangeEnd < monthEnd ? rangeEnd.getDate() : totalDays;

      console.log('----------------------------');
      console.log('monthStart', monthStart);
      console.log('monthEnd', monthEnd);
      console.log('rangeStart', rangeStart);
      console.log('rangeEnd', rangeEnd);

      let label = '';
      // if start day is in month and year, show start day
      if (rangeStart.getMonth() === monthIndex && rangeStart.getFullYear() === currentYear) {
        label = rangeStart.toLocaleDateString();
      }
      // if end day is in month and year, show end day
      if (rangeEnd.getMonth() === monthIndex && rangeEnd.getFullYear() === currentYear) {
        label = `${rangeEnd.toLocaleDateString()}`;
      }

      // if both start and end are in the month and year, show both
      if (
        rangeStart.getMonth() === monthIndex &&
        rangeStart.getFullYear() === currentYear &&
        rangeEnd.getMonth() === monthIndex &&
        rangeEnd.getFullYear() === currentYear
      ) {
        label = `${rangeStart.toLocaleDateString()} - ${rangeEnd.toLocaleDateString()}`;
      }

      return {
        covered: true,
        startDay,
        endDay,
        totalDays,
        label,
      };
    }
    return { covered: false };
  };

  return (
    <div className="annual-date-range">
      {/* Year Navigation */}
      <div className="year-navigation">
        <button type="button" onClick={handlePreviousYear} className="nav-button" aria-label="Previous year">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <span className="year-display">{currentYear}</span>

        <button type="button" onClick={handleNextYear} className="nav-button" aria-label="Next year">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Month Grid */}
      <div className="month-grid">
        {/* Month Headers */}
        {MONTHS.map((month) => (
          <div key={month} className="month-header">
            {month}
          </div>
        ))}

        {/* Month Cells */}
        {dateRanges.length > 0 &&
          dateRanges.map((_, index) =>
            MONTHS.map((month, monthIdx) => {
              const coverage = getMonthCoverageInRange(index, monthIdx);
              return (
                <div key={`${month}-${index}-cell`} className={`month-cell ${coverage.covered ? 'covered' : ''}`}>
                  {coverage.covered && <div className="coverage-label">{coverage.label}</div>}
                </div>
              );
            })
          )}
      </div>
    </div>
  );
}
