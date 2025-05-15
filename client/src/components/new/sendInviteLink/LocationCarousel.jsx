import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { setSelectedLocation } from '@/redux/slices/getTogetherSlice';

export default function LocationCarousel({ locations = [] }) {
  const dispatch = useDispatch();

  const validLocations = locations.filter(
    (location) =>
      location && location.name && location.name !== 'No Location Selected'
  );

  if (validLocations.length === 0) return null;

  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex justify-between items-center">
        {validLocations.length > 1 && (
          <button onClick={goToPrevious} className="p-2">
            <ChevronLeftIcon className="h-6 w-6 text-rallyBlue" />
          </button>
        )}

        <div className="flex-1 flex justify-center items-center">
          <h3
            className="text-md font-semibold text-rallyBlue text-center truncate whitespace-nowrap overflow-hidden w-full max-w-[200px] cursor-pointer"
            onClick={() => handleLocationClick(validLocations[currentIndex])}
          >
            {validLocations[currentIndex]?.name || ''}
          </h3>
        </div>

        {validLocations.length > 1 && (
          <button onClick={goToNext} className="p-2">
            <ChevronRightIcon className="h-6 w-6 text-rallyBlue" />
          </button>
        )}
      </div>
    </div>
  );
}
