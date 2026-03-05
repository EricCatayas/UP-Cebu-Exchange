'use client';
import { DURATION_OPTIONS } from '@/lib/constants';

export default function RentalPeriodCard({
  duration,
  onDurationChange,
  startDate,
  onStartDateChange,
  endDate,
}: {
  duration: number;
  onDurationChange?: (duration: number) => void;
  startDate: string;
  onStartDateChange?: (date: string) => void;
  endDate: string;
}) {
  const disableStartDate = onStartDateChange === undefined;
  const disableDuration = onDurationChange === undefined;

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onStartDateChange) {
      onStartDateChange(e.target.value);
    }
  };

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Rental Period</h2>

      <div className="space-y-4">
        {/* Duration */}
        <div>
          <label className="block text-sm font-semibold mb-2">Duration</label>
          <select
            value={duration}
            onChange={(e) => onDurationChange(Number(e.target.value))}
            disabled={disableDuration}
            className="w-full md:min-w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {DURATION_OPTIONS.map((months) => (
              <option key={months} value={months}>
                {months} Months
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-semibold mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={handleStartDateChange}
              disabled={disableStartDate}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                disableStartDate ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed' : 'border-gray-300'
              }`}
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-semibold mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
