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

export default function DateCarousel({
  selectedDate,
  handleDateChange,
  locationDates,
}) {
  console.log('[DateCarousel] Component mounted with props:', {
    selectedDate,
    locationDates,
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [error, setError] = useState('');

  const visibleDates = getWeekRange(currentDate);
  const today = startOfDay(new Date());

  console.log('[DateCarousel] Current state:', {
    currentDate,
    visibleDates,
    today,
  });

  const handlePrevWeek = () => {
    console.log('[DateCarousel] Previous week requested');
    setCurrentDate(subDays(currentDate, 7));
  };

  const handleNextWeek = () => {
    console.log('[DateCarousel] Next week requested');
    setCurrentDate(addDays(currentDate, 7));
  };

  const handleDateClick = (date) => {
    console.log('[DateCarousel] Date clicked:', {
      clickedDate: date,
      isPast: isBefore(date, today),
    });

    const dateToCheck = startOfDay(date);
    if (isBefore(dateToCheck, today)) {
      console.log('[DateCarousel] Past date selected, showing error');
      setError('You cant select a past date.');
      setTimeout(() => setError(''), 2000);
      return;
    }
    handleDateChange(dateToCheck);
  };

  return (
    <div className="flex flex-col items-center space-y-2 w-full">
      {/* Error Message (if any) */}
      {error &&
        (console.log('[DateCarousel] Error state:', error),
        (<div className="text-red-500 text-xs">{error}</div>))}

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
            const isAvailable = locationDates.some((availableDate) => {
              const parsedAvailable = new Date(availableDate);
              return (
                parsedAvailable.getUTCFullYear() === date.getUTCFullYear() &&
                parsedAvailable.getUTCMonth() === date.getUTCMonth() &&
                parsedAvailable.getUTCDate() === date.getUTCDate()
              );
            });

            console.log('[DateCarousel] Checking if available:', {
              candidate: date.toISOString(),
              availableDates: locationDates.map((d) =>
                new Date(d).toISOString()
              ),
            });

            console.log('[DateCarousel] Rendering date button:', {
              date,
              isSelected,
              isCurrent,
              isPast,
              isAvailable,
            });

            return (
              <button
                key={date.toISOString()}
                onClick={() => handleDateClick(date)}
                disabled={!isAvailable}
                className={`flex flex-col items-center justify-center w-12 h-14 rounded-lg ${
                  isSelected
                    ? 'bg-rallyBlue text-white'
                    : isCurrent
                    ? 'text-rallyBlue font-semibold'
                    : isAvailable
                    ? 'bg-rallyYellow text-black'
                    : 'text-gray-700 opacity-50 cursor-not-allowed'
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
