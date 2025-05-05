'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPendingEvents,
  fetchFullEventDetails,
} from '@/redux/slices/eventsSlice';
import RSVPTimeOptions from '@/components/rsvp/RSVPTimeOptions';
import RSVPTimeGrid from '@/components/rsvp/RSVPTimeGrid';
import DateCarousel from '@/components/rsvp/RSVPDateCarousel';
import RSVPLocationCarousel from '@/components/rsvp/RSVPLocationCarousel';
import UserList from '@/components/new/pollLocationTime/UserList';
import {
  mockPendingEvents,
  mockFullEventDetails,
} from '@/api/events/mockEvents';

export default function RSVP() {
  console.log('[RSVP] Component mounted');
  const dispatch = useDispatch();
  const [selectedEventUuid, setSelectedEventUuid] = useState('');
  const [selectedEvent, setSelectedEvent] = useState({});
  const [currentIndex, setCurrentIndex] = useState(1); // Start with the second item as the center one.

  const [location, setLocation] = useState({});

  const pendingEvents = mockPendingEvents;
  const fullEventDetails = mockFullEventDetails;
  const loadingEventIds = [];

  useEffect(() => {
    console.log('[RSVP] Initial pendingEvents effect triggered', {
      pendingEvents,
    });
    if (pendingEvents.length > 0) {
      console.log('[RSVP] Setting initial selectedEventUuid', {
        eventUuid: pendingEvents[0].eventUuid,
      });
      setSelectedEventUuid(pendingEvents[0].eventUuid);
    }
  }, []);

  useEffect(() => {
    console.log('[RSVP] Location effect triggered', {
      selectedEvent,
      currentIndex,
      hasLocations: Array.isArray(selectedEvent.locations),
      locationsLength: selectedEvent.locations?.length,
    });

    if (
      selectedEvent &&
      Array.isArray(selectedEvent.locations) &&
      selectedEvent.locations.length > 0
    ) {
      const safeIndex =
        currentIndex < selectedEvent.locations.length ? currentIndex : 0;
      console.log('[RSVP] Setting new location', {
        safeIndex,
        location: selectedEvent.locations[safeIndex],
      });
      setLocation(selectedEvent.locations[safeIndex]);
    } else {
      console.log('[RSVP] No valid location found, resetting location state');
      setLocation({});
    }
  }, [selectedEvent, currentIndex]);
  // const [selectedLocation, setSelectedLocations] = useState({});
  const [localSelectedDate, setLocalSelectedDate] = useState(new Date());

  const [userSelections, setUserSelections] = useState({});

  // Get events state from Redux
  // const pendingEvents = useSelector((state) => state.events.pendingEvents);
  // const fullEventDetails = useSelector(
  //   (state) => state.events.fullEventDetails
  // );
  // const loadingEventIds = useSelector((state) => state.events.loadingEventIds);

  // // Fetch pending events on mount
  // useEffect(() => {
  //   dispatch(fetchPendingEvents());
  // }, [dispatch]);

  // useEffect(() => {
  //   if (pendingEvents.length > 0 && !selectedEventUuid) {
  //     const firstEvent = pendingEvents[0];
  //     const uuid = firstEvent.eventUuid;

  //     // Set as selected if not already selected
  //     setSelectedEventUuid(uuid);

  //     // Only dispatch fetch if full details not already loaded
  //     if (!fullEventDetails[uuid]) {
  //       dispatch(fetchFullEventDetails(uuid));
  //     }
  //   }
  // }, [pendingEvents, selectedEventUuid, fullEventDetails, dispatch]);

  const handleSelectEvent = (eventUuid) => {
    console.log('[RSVP] handleSelectEvent called', { eventUuid });
    if (!fullEventDetails[eventUuid]) {
      console.log('[RSVP] Fetching full event details', { eventUuid });
      dispatch(fetchFullEventDetails(eventUuid));
    }
    setSelectedEventUuid(eventUuid);
  };

  const handleSubmit = (selections) => {
    console.log('[RSVP] handleSubmit called', { selections });
    setUserSelections(selections);
  };

  useEffect(() => {
    console.log('[RSVP] selectedEventUuid or fullEventDetails changed', {
      selectedEventUuid,
      hasFullDetails: !!fullEventDetails[selectedEventUuid],
    });

    if (selectedEventUuid && fullEventDetails[selectedEventUuid]) {
      console.log('[RSVP] Setting selected event', {
        event: fullEventDetails[selectedEventUuid],
      });
      setSelectedEvent(fullEventDetails[selectedEventUuid]);
    }
  }, [selectedEventUuid, fullEventDetails]);

  const isLoading = loadingEventIds.includes(selectedEventUuid);
  console.log('[RSVP] Render state', {
    isLoading,
    selectedEventUuid,
    hasSelectedEvent: !!selectedEvent,
    pendingEventsCount: pendingEvents.length,
  });

  if (isLoading) {
    console.log('[RSVP] Rendering loading state');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading event details...</div>
      </div>
    );
  }

  if (!selectedEvent && pendingEvents.length === 0) {
    console.log('[RSVP] Rendering no events state');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">
          You're all caught up! Go to Upcoming to see upcoming events or
          Highlights to view past events.
        </div>
      </div>
    );
  }

  // Get available times for the selected date and location
  const getAvailableTimesForDate = (date, location) => {
    console.log('[RSVP] getAvailableTimesForDate called', { date, location });
    const dateObj = location?.dates?.find(
      (d) => new Date(d.date).toDateString() === date.toDateString()
    );
    const times = dateObj?.times || {};
    console.log('[RSVP] Found available times', { times });
    return times;
  };

  console.log('[RSVP] Rendering main component', {
    selectedEvent,
    location,
    currentIndex,
  });

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
          <RSVPLocationCarousel
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            locations={selectedEvent.locations}
          />
          <div className="flex w-[90%] flex-col items-center mt-5">
            <h2 className="mb-2">Get-Together Time Option(s)</h2>
            <RSVPTimeOptions
              eventUuid={selectedEventUuid}
              location={location}
            />
            <UserList users={selectedEvent.users} />
          </div>
        </>
      )}
    </div>
  );
}
