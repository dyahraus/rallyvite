import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function LocationCarousel({ locations }) {
  const [currentIndex, setCurrentIndex] = useState(1); // Start with the second item as the center one.

  const goToNext = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === locations.length - 1) return 0; // Loop back to the start
      return prevIndex + 1;
    });
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0) return locations.length - 1; // Loop to the end
      return prevIndex - 1;
    });
  };

  const getVisibleLocations = () => {
    const leftIndex = (currentIndex - 1 + locations.length) % locations.length;
    const rightIndex = (currentIndex + 1) % locations.length;

    return [
      locations[leftIndex], // Left location
      locations[currentIndex], // Center location
      locations[rightIndex], // Right location
    ];
  };

  return (
    <div className=" max-w-lg mx-auto">
      <div className="flex justify-between items-center">
        {/* Left Arrow */}
        <button onClick={goToPrevious} className="p-2">
          <ChevronLeftIcon className="h-6 w-6 text-rallyBlue" />
        </button>

        {/* Location Information */}
        <div className="flex justify-center items-center space-x-4 flex-1">
          {getVisibleLocations().map((location, index) => (
            <div
              key={index}
              className={`text-center ${index === 1 ? 'font-semibold' : ''}`}
            >
              <h3 className="text-lg">{location.name}</h3>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button onClick={goToNext} className="p-2">
          <ChevronRightIcon className="h-6 w-6 text-rallyBlue" />
        </button>
      </div>
    </div>
  );
}
