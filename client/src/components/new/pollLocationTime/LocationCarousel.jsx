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
}) {
  const dispatch = useDispatch();

  // Filter out 'No Location Selected' locations and ensure location objects are valid
  const validLocations = locations.filter(
    (location) =>
      location && location.name && location.name !== 'No Location Selected'
  );

  // If no valid locations, return null
  if (validLocations.length === 0) return null;

  const [currentIndex, setCurrentIndex] = useState(1); // Start with the second item as the center one.

  const goToNext = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === validLocations.length - 1) return 0; // Loop back to the start
      return prevIndex + 1;
    });
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0) return validLocations.length - 1; // Loop to the end
      return prevIndex - 1;
    });
  };

  const getVisibleLocations = () => {
    if (validLocations.length === 1) {
      return [validLocations[0]];
    }

    const leftIndex =
      (currentIndex - 1 + validLocations.length) % validLocations.length;
    const rightIndex = (currentIndex + 1) % validLocations.length;

    return [
      validLocations[leftIndex], // Left location
      validLocations[currentIndex], // Center location
      validLocations[rightIndex], // Right location
    ];
  };

  const visibleLocations = getVisibleLocations();

  useEffect(() => {
    const centerLocation = validLocations[currentIndex];
    if (centerLocation) {
      dispatch(setSelectedLocation(centerLocation));
    }
  }, [currentIndex, validLocations]);

  return (
    <div className="w-full flex flex-col items-center px-4">
      <div className="flex justify-between items-center">
        {/* Left Arrow - Only show if more than one location */}
        {validLocations.length > 1 && (
          <button onClick={goToPrevious} className="p-2">
            <ChevronLeftIcon className="h-6 w-6 text-rallyBlue" />
          </button>
        )}

        {/* Location Information */}

        <div className="flex justify-center items-center space-x-4 flex-1">
          {visibleLocations.map((location, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-300 ${
                index === 1 || validLocations.length === 1
                  ? 'font-bold'
                  : 'text-gray-400 text-xs opacity-60'
              }`}
            >
              <h3 className="text-lg">{location?.name || ''}</h3>
            </div>
          ))}
        </div>

        {/* Right Arrow - Only show if more than one location */}
        {validLocations.length > 1 && (
          <button onClick={goToNext} className="p-2">
            <ChevronRightIcon className="h-6 w-6 text-rallyBlue" />
          </button>
        )}
      </div>

      {!expanded ? (
        <div
          className="flex flex-col items-center justify-center mt-2 text-rallyBlue cursor-pointer"
          onClick={() => {
            setExpanded(true);
            setActiveStep('addLoc');
          }}
        >
          <PlusCircleIcon className="w-10 h-10 stroke-1" />
          <span className="ml-2 text-sm">Add Another Location Option</span>
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
