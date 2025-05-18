'use client';

import { useEffect, useState } from 'react';
import RSVPLocationCarousel from '@/components/rsvp/RSVPLocationCarousel';
import RSVPTimeOptions from '@/components/rsvp/RSVPTimeOptionsDraft';
import RSVPSummary from '@/components/rsvp/RSVPSummary';
import RSVPBar from '@/components/navigation/RSVPBar';
import BottomActionBar from '@/components/navigation/BottomActionBar';
import RSVPEventCarousel from '@/components/rsvp/RSVPEventCarousel';

const RSVPSection = ({
  event,
  setEvent,
  currentIndex,
  setCurrentIndex,
  setCurrentStep,
  setResponse,
}) => {
  const validLocations =
    event?.locations?.filter(
      (location) =>
        location && location.name && location.name !== 'No Location Selected'
    ) || [];

  if (!validLocations.length) return null;

  return (
    <>
      <RSVPLocationCarousel
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        locations={validLocations}
      />
      <div className="flex w-[90%] flex-col items-center mt-5">
        <RSVPTimeOptions
          setEvent={setEvent}
          location={validLocations[currentIndex]}
          event={event}
          setCurrentStep={setCurrentStep}
          setResponse={setResponse}
        />
      </div>
    </>
  );
};

export default function RSVPInboxPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]); // Multiple events from backend
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [response, setResponse] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchUnrespondedEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/events/user/unresponded');
        const data = await res.json();

        if (!isMounted) return;

        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setError('Failed to load RSVP events.');
        }
      } catch (err) {
        if (isMounted) setError('Failed to load RSVP events.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUnrespondedEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeEvent = events[activeEventIndex];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading RSVP events...</div>
      </div>
    );
  }

  if (error || !events.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">
          {error || 'No events to RSVP to.'}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center pt-6 pb-[64px]">
        <RSVPEventCarousel
          currentIndex={activeEventIndex}
          setCurrentIndex={setActiveEventIndex}
          events={events}
        />
        {currentStep === 1 ? (
          <RSVPSection
            event={activeEvent}
            setEvent={(updated) => {
              const newEvents = [...events];
              newEvents[activeEventIndex] = updated;
              setEvents(newEvents);
            }}
            currentIndex={currentLocationIndex}
            setCurrentIndex={setCurrentLocationIndex}
            setCurrentStep={setCurrentStep}
            setResponse={setResponse}
          />
        ) : (
          <RSVPSummary response={response} event={activeEvent} />
        )}
      </div>

      <div className="fixed bottom-0 w-full flex flex-col items-center">
        {currentStep === 1 && (
          <RSVPBar setCurrentStep={setCurrentStep} setResponse={setResponse} />
        )}
        <BottomActionBar />
      </div>
    </>
  );
}
