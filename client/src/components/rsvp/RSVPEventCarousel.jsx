'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function RSVPEventCarousel({
  currentIndex,
  setCurrentIndex,
  events,
}) {
  if (!events || events.length === 0) return null;

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === events.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="w-full flex flex-col items-center px-4 mt-3">
      <div className="flex justify-between items-center w-full">
        {/* Left Arrow */}
        {events.length > 1 && (
          <button onClick={goToPrevious} className="p-2">
            <ChevronLeftIcon className="h-6 w-6 text-rallyBlue" />
          </button>
        )}

        {/* Center Event Name */}
        <div className="flex-1 flex justify-center items-center">
          <h3 className="text-sm font-bold text-center truncate whitespace-nowrap overflow-hidden w-full max-w-[200px] text-rallyBlue">
            {events[currentIndex]?.name || 'Untitled Event'}
          </h3>
        </div>

        {/* Right Arrow */}
        {events.length > 1 && (
          <button onClick={goToNext} className="p-2">
            <ChevronRightIcon className="h-6 w-6 text-rallyBlue" />
          </button>
        )}
      </div>
    </div>
  );
}
