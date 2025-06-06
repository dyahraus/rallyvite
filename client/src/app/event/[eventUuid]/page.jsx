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
import RSVPBar from '../../../components/navigation/RSVPBar';
import RSVPSummary from '../../../components/rsvp/RSVPSummary';

const RSVPSection = ({
  event,
  setEvent,
  currentIndex,
  setCurrentIndex,
  setCurrentStep,
  setResponse,
}) => {
  // Filter out 'No Location Selected' locations and ensure location objects are valid
  const validLocations =
    event?.locations?.filter(
      (location) =>
        location && location.name && location.name !== 'No Location Selected'
    ) || [];

  if (!validLocations.length) return null;

  return (
    <>
      <h1 className="font-bold text-xl">{event?.name || 'New Rallyvite'}</h1>
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

export default function EventPage() {
  const { eventUuid } = useParams();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [event, setEvent] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [response, setResponse] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const result = await findEventAndConvert(eventUuid);

        if (!isMounted) return;

        if (result.status === 'SUCCESS') {
          setEvent(result.event);
          console.log(result.event);
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
    <>
      <div className="min-h-screen flex flex-col items-center pt-6 pb-[64px]">
        {currentStep === 1 ? (
          <RSVPSection
            event={event}
            setEvent={setEvent}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            setCurrentStep={setCurrentStep}
            setResponse={setResponse}
          />
        ) : (
          <RSVPSummary response={response} event={event} />
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
