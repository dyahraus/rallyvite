'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPendingEvents,
  fetchFullEventDetails,
} from '@/redux/slices/eventsSlice';
import RSVPTimeGrid from '@/components/rsvp/RSVPTimeGrid';
import DateCarousel from '@/components/rsvp/RSVPDateCarousel';
import UserList from '@/components/new/pollLocationTime/UserList';

export default function RSVP() {
  const { eventUuid } = useParams();
  const dispatch = useDispatch();
  const [selectedEventUuid, setSelectedEventUuid] = useState(eventUuid || '');
  const [localSelectedDate, setLocalSelectedDate] = useState(new Date());
  const [userSelections, setUserSelections] = useState({});

  // Get events state from Redux
  const pendingEvents = useSelector((state) => state.events.pendingEvents);
  const fullEventDetails = useSelector(
    (state) => state.events.fullEventDetails
  );
  const loadingEventIds = useSelector((state) => state.events.loadingEventIds);

  // Fetch pending events on mount
  useEffect(() => {
    dispatch(fetchPendingEvents());
  }, [dispatch]);

  // Prefetch first event details
  useEffect(() => {
    if (
      pendingEvents.length > 0 &&
      !fullEventDetails[pendingEvents[0].eventUuid]
    ) {
      dispatch(fetchFullEventDetails(pendingEvents[0].eventUuid));
    }
  }, [pendingEvents, fullEventDetails, dispatch]);

  // Fetch event details when UUID is provided
  useEffect(() => {
    if (eventUuid && !fullEventDetails[eventUuid]) {
      dispatch(fetchFullEventDetails(eventUuid));
      setSelectedEventUuid(eventUuid);
    }
  }, [eventUuid, fullEventDetails, dispatch]);

  const handleSelectEvent = (eventUuid) => {
    if (!fullEventDetails[eventUuid]) {
      dispatch(fetchFullEventDetails(eventUuid));
    }
    setSelectedEventUuid(eventUuid);
  };

  const handleDateChange = (date) => {
    setLocalSelectedDate(date);
  };

  const handleSubmit = (selections) => {
    setUserSelections(selections);
  };

  const selectedEvent = fullEventDetails[selectedEventUuid];
  const isLoading = loadingEventIds.includes(selectedEventUuid);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading event details...</div>
      </div>
    );
  }

  if (!selectedEvent && pendingEvents.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">No events found</div>
      </div>
    );
  }

  // Get available times for the selected date and location
  const getAvailableTimesForDate = (date, location) => {
    const dateObj = location?.dates?.find(
      (d) => new Date(d.date).toDateString() === date.toDateString()
    );
    return dateObj?.times || {};
  };

  return (
    <div className="h-screen flex flex-col items-center pt-6">
      {/* Event Selection Carousel */}
      <div className="w-full max-w-4xl mb-6 px-4">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {pendingEvents.map((event) => (
            <button
              key={event.eventUuid}
              onClick={() => handleSelectEvent(event.eventUuid)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedEventUuid === event.eventUuid
                  ? 'bg-rallyYellow text-black'
                  : 'bg-rallyBlue text-white hover:bg-rallyBlue/80'
              }`}
            >
              {event.name}
              {event.isAwaitingResponse && (
                <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                  Response Needed
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {selectedEvent && (
        <>
          <h1 className="font-bold text-xl">{selectedEvent.name}</h1>
          {selectedEvent.description && (
            <p className="text-gray-600 mt-2">{selectedEvent.description}</p>
          )}
          <LocationCarousel locations={selectedEvent.locations} />
          <div className="flex w-[90%] flex-col items-center mt-5">
            <h2 className="mb-2">Get-Together Time Option(s)</h2>
            <DateCarousel
              selectedDate={localSelectedDate}
              handleDateChange={handleDateChange}
            />
            <div className="flex flex-row">
              <RSVPTimeGrid
                times={userSelections}
                selectedDate={localSelectedDate}
                availableSlots={getAvailableTimesForDate(
                  localSelectedDate,
                  selectedEvent.selectedLocation
                )}
                onTimeSubmit={handleSubmit}
              />
              <UserList users={selectedEvent.users} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
