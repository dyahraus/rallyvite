'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { findEventAndConvert } from '@/api/events/findEvent';
import RSVPLocationCarousel from '../../../components/rsvp/RSVPLocationCarousel';
import { useDispatch, useSelector } from 'react-redux';
import { setGetTogether } from '@/redux/slices/getTogetherSlice';
import RSVPTimeOptions from '../../../components/rsvp/RSVPTimeOptionsDraft';
import { openInvite } from '@/api/events/openInvite';
import { BottomActionBarProvider } from '@/context/BottomActionBarContext';
import BottomActionBar from '@/components/navigation/BottomActionBar';

const RSVPSection = ({ event, setEvent, currentIndex, setCurrentIndex }) => {
  if (!event?.locations?.length) return null;

  return (
    <>
      <h1 className="font-bold text-xl">{event?.name || 'New Rallyvite'}</h1>
      <RSVPLocationCarousel
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        locations={event.locations}
      />
      <div className="flex w-[90%] flex-col items-center mt-5">
        <h2 className="mb-2">Get-Together Time Option(s)</h2>
        <RSVPTimeOptions setEvent={setEvent} location={event.locations[0]} />
      </div>
    </>
  );
};

export default function EventPage() {
  const { eventUuid } = useParams();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [event, setEvent] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(1);

  const [timeSelections, setTimeSelections] = useState({});
  console.log(
    '[RSVPTimeOptions] Initial localSelectedDate:',
    localSelectedDate
  );

  useEffect(() => {
    let isMounted = true;

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const result = await findEventAndConvert(eventUuid);
        console.log(result);

        if (!isMounted) return;

        if (result.status === 'SUCCESS') {
          setEvent(result.event);
          console.log(event);
        } else {
          setError(result.error);
        }
      } catch (err) {
        if (!isMounted) return;
        setError('Failed to load event details');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (eventUuid) {
      fetchEvent();
    }

    return () => {
      isMounted = false;
    };
  }, [eventUuid]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading event details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <BottomActionBarProvider>
      <div className="h-screen flex flex-col items-center pt-6">
        {currentStep === 1 && (
          <RSVPSection
            event={event}
            setEvent={setEvent}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        )}
        <BottomActionBar />
      </div>
    </BottomActionBarProvider>
  );
}
