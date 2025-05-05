import { useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';

export default function LocationCarousel({
  currentIndex,
  setCurrentIndex,
  locations,
}) {
  console.log('[LocationCarousel] Component mounted with props:', {
    currentIndex,
    locations,
  });

  // Filter out 'No Location Selected' locations and ensure location objects are valid
  const validLocations = locations.filter(
    (location) =>
      location && location.name && location.name !== 'No Location Selected'
  );

  console.log('[LocationCarousel] Filtered valid locations:', validLocations);

  // If no valid locations, return null
  if (validLocations.length === 0) {
    console.log('[LocationCarousel] No valid locations found, returning null');
    return null;
  }

  const goToNext = () => {
    console.log('[LocationCarousel] Going to next location');
    setCurrentIndex((prevIndex) => {
      const newIndex =
        prevIndex === validLocations.length - 1 ? 0 : prevIndex + 1;
      console.log('[LocationCarousel] New index:', newIndex);
      return newIndex;
    });
  };

  const goToPrevious = () => {
    console.log('[LocationCarousel] Going to previous location');
    setCurrentIndex((prevIndex) => {
      const newIndex =
        prevIndex === 0 ? validLocations.length - 1 : prevIndex - 1;
      console.log('[LocationCarousel] New index:', newIndex);
      return newIndex;
    });
  };

  const getVisibleLocations = () => {
    console.log(
      '[LocationCarousel] Getting visible locations for index:',
      currentIndex
    );

    if (validLocations.length === 1) {
      console.log('[LocationCarousel] Only one location available');
      return [validLocations[0]];
    }

    const leftIndex =
      (currentIndex - 1 + validLocations.length) % validLocations.length;
    const rightIndex = (currentIndex + 1) % validLocations.length;

    const visible = [
      validLocations[leftIndex],
      validLocations[currentIndex],
      validLocations[rightIndex],
    ];

    console.log('[LocationCarousel] Visible locations:', {
      left: visible[0],
      center: visible[1],
      right: visible[2],
    });

    return visible;
  };

  const visibleLocations = getVisibleLocations();

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex justify-between items-center">
        {/* Left Arrow - Only show if more than one location */}
        {validLocations.length > 1 && (
          <button onClick={goToPrevious} className="p-2">
            <ChevronLeftIcon className="h-6 w-6 text-rallyBlue" />
          </button>
        )}

        {/* Location Information */}
        <div className="flex justify-center items-center space-x-4 flex-1">
          {visibleLocations.map((location, index) => {
            console.log('[LocationCarousel] Rendering location:', {
              index,
              location,
              isCenter: index === 1 || validLocations.length === 1,
            });

            return (
              <div
                key={index}
                className={`text-center cursor-pointer ${
                  index === 1 || validLocations.length === 1
                    ? 'font-semibold text-rallyBlue text-sm'
                    : 'text-gray-400 text-xs opacity-60'
                }`}
              >
                <h3 className="text-lg">{location?.name || ''}</h3>
              </div>
            );
          })}
        </div>

        {/* Right Arrow - Only show if more than one location */}
        {validLocations.length > 1 && (
          <button onClick={goToNext} className="p-2">
            <ChevronRightIcon className="h-6 w-6 text-rallyBlue" />
          </button>
        )}
      </div>
    </div>
  );
}
