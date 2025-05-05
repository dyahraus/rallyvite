import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { setSelectedLocation } from '@/redux/slices/getTogetherSlice';

export default function LocationCarousel({ locations = [] }) {
  const dispatch = useDispatch();
  // Filter out 'No Location Selected' locations and ensure location objects are valid
  const validLocations = locations.filter(
    (location) =>
      location && location.name && location.name !== 'No Location Selected'
  );

  // If no valid locations, return null
  if (validLocations.length === 0) return null;

  const [currentIndex, setCurrentIndex] = useState(1); // Start with the second item as the center one.

  useEffect(() => {
    if (validLocations.length > 0) {
      dispatch(setSelectedLocation(validLocations[currentIndex]));
    }
  }, [validLocations, currentIndex]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex =
        prevIndex === validLocations.length - 1 ? 0 : prevIndex + 1;
      dispatch(setSelectedLocation(validLocations[newIndex]));
      return newIndex;
    });
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex =
        prevIndex === 0 ? validLocations.length - 1 : prevIndex - 1;
      dispatch(setSelectedLocation(validLocations[newIndex]));
      return newIndex;
    });
  };

  const handleLocationClick = (location) => {
    dispatch(setSelectedLocation(location));
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
          {visibleLocations.map((location, index) => (
            <div
              key={index}
              className={`text-center cursor-pointer ${
                index === 1 || validLocations.length === 1
                  ? 'font-semibold text-rallyBlue text-sm'
                  : 'text-gray-400 text-xs opacity-60'
              }`}
              onClick={() => handleLocationClick(location)}
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
    </div>
  );
}
