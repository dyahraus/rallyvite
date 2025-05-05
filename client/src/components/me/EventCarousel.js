import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';

export default function EventCarousel({
  events,
  currentIndex,
  setCurrentIndex,
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

  const getVisibleEvents = () => {
    if (events.length === 1) return [events[0]];

    const leftIndex = (currentIndex - 1 + events.length) % events.length;
    const rightIndex = (currentIndex + 1) % events.length;

    return [events[leftIndex], events[currentIndex], events[rightIndex]];
  };

  const visibleEvents = getVisibleEvents();

  return (
    <div className="max-w-lg mx-auto mt-12">
      <div className="flex justify-between items-center">
        {events.length > 1 && (
          <button onClick={goToPrevious} className="p-2">
            <ChevronLeftIcon className="h-6 w-6 text-rallyBlue" />
          </button>
        )}

        <div className="flex justify-center items-center space-x-4 flex-1">
          {visibleEvents.map((event, index) => (
            <div
              key={event.id || index}
              className={`text-center ${
                index === 1 || events.length === 1 ? 'font-bold' : ''
              }`}
            >
              <h3 className="text-lg truncate max-w-[120px]">
                {event.name || 'Untitled'}
              </h3>
            </div>
          ))}
        </div>

        {events.length > 1 && (
          <button onClick={goToNext} className="p-2">
            <ChevronRightIcon className="h-6 w-6 text-rallyBlue" />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center justify-center mt-2 text-rallyBlue">
        <PlusCircleIcon className="w-10 h-10 stroke-1" />
        <span className="ml-2 text-sm">Add Another Get-Together</span>
      </div>
    </div>
  );
}
