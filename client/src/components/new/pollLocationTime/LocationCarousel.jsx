'use client';
import { useState, useEffect } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import AddLocationOption from './AddLocationOption';
import { useDispatch } from 'react-redux';
import { setSelectedLocation } from '@/redux/slices/getTogetherSlice';

export default function LocationCarousel({
  setActiveStep,
  locations = [],
  onLocationSubmit,
  expanded,
  setExpanded,
  onAddLocation,
}) {
  const dispatch = useDispatch();

  const validLocations = locations.filter(
    (location) =>
      location && location.name && location.name !== 'No Location Selected'
  );

  if (validLocations.length === 0) return null;

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === validLocations.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? validLocations.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const centerLocation = validLocations[currentIndex];
    if (centerLocation) {
      dispatch(setSelectedLocation(centerLocation));
    }
  }, [currentIndex, validLocations]);

  return (
    <div className="w-full flex flex-col items-center px-4">
      <div className="flex justify-between items-center w-full">
        {/* Left Arrow */}
        {validLocations.length > 1 && (
          <button onClick={goToPrevious} className="p-2">
            <ChevronLeftIcon className="h-6 w-6 text-rallyBlue" />
          </button>
        )}

        {/* Only Center Location */}
        <div className="flex-1 flex justify-center items-center">
          <h3 className="text-md font-bold text-center truncate whitespace-nowrap overflow-hidden w-full max-w-[200px]">
            {validLocations[currentIndex]?.name || ''}
          </h3>
        </div>

        {/* Right Arrow */}
        {validLocations.length > 1 && (
          <button onClick={goToNext} className="p-2">
            <ChevronRightIcon className="h-6 w-6 text-rallyBlue" />
          </button>
        )}
      </div>

      {!expanded ? (
        <div
          className="flex flex-col items-center justify-center mt-2 text-rallyBlue cursor-pointer"
          onClick={onAddLocation}
        >
          <PlusCircleIcon className="w-7 h-7 mb-1 stroke-1" />
          <span className="ml-2 text-xs">Add Another Location Option</span>
        </div>
      ) : (
        <div className="flex w-full justify-center">
          <AddLocationOption
            setExpanded={setExpanded}
            onLocationSubmit={onLocationSubmit}
          />
        </div>
      )}
    </div>
  );
}
