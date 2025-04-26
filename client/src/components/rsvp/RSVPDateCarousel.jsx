'use client';
import { useState } from 'react';
import {
  format,
  addDays,
  subDays,
  isToday,
  isSameDay,
  startOfWeek,
  isBefore,
  startOfDay,
} from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Helper to always get the 7 days from Sunday to Saturday
const getWeekRange = (startDate) => {
  const start = startOfWeek(startDate, { weekStartsOn: 0 }); // 0 = Sunday
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

export default function DateCarousel({ selectedDate, handleDateChange }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [error, setError] = useState(''); // To show error if user selects invalid date

  const visibleDates = getWeekRange(currentDate); // Always get the current Sunday-Saturday week
  const today = startOfDay(new Date());

  const handlePrevWeek = () => setCurrentDate(subDays(currentDate, 7));
  const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));

  const handleDateClick = (date) => {
    const dateToCheck = startOfDay(date);
    if (isBefore(dateToCheck, today)) {
      setError('You cant select a past date.');
      setTimeout(() => setError(''), 2000); // Auto-hide error after 2 seconds
      return;
    }
    handleDateChange(dateToCheck); // Proceed normally if date is valid
  };

  return (
    <div className="flex flex-col items-center space-y-2 w-full">
      {/* Error Message (if any) */}
      {error && <div className="text-red-500 text-xs">{error}</div>}

      <div className="flex items-center space-x-1 w-full">
        {/* Left Arrow */}
        <button onClick={handlePrevWeek} className="p-1">
          <ChevronLeftIcon className="h-6 w-6 text-gray-500" />
        </button>

        {/* Date Bar */}
        <div className="flex flex-1 overflow-x-auto space-x-2">
          {visibleDates.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            const isCurrent = isToday(date);
            const isPast = isBefore(date, today);

            return (
              <button
                key={date.toISOString()}
                onClick={() => handleDateClick(date)}
                className={`flex flex-col items-center justify-center w-12 h-14 rounded-lg ${
                  isSelected
                    ? 'bg-rallyBlue text-white'
                    : isCurrent
                    ? 'text-rallyBlue font-semibold'
                    : 'text-gray-700'
                }`}
              >
                <span className="text-xs uppercase">
                  {isSelected ? format(date, 'EEE') : format(date, 'EEEEE')}
                </span>
                <span className="text-lg font-medium">{format(date, 'd')}</span>
              </button>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button onClick={handleNextWeek} className="p-1">
          <ChevronRightIcon className="h-6 w-6 text-gray-500" />
        </button>
      </div>
    </div>
  );
}
