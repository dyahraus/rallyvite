'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { findEventAndConvert } from '@/api/events/findEvent';
import { useDispatch, useSelector } from 'react-redux';
import { setGetTogether } from '@/redux/slices/getTogetherSlice';
import RSVPTimeGrid from '../../../components/rsvp/RSVPTimeGrid';
import { openInvite } from '@/api/events/openInvite';

export default function EventPage() {
  const { eventUuid } = useParams();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('invite');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = (useState < string) | (null > null);

  // Get the getTogether state from Redux
  const getTogether = useSelector((state) => state.getTogether);
  const locations = getTogether.locations;
  const name = getTogether.name;

  useEffect(() => {
    if (typeof inviteToken === 'string') {
      localStorage.setItem('inviteToken', inviteToken);

      openInvite({ token: inviteToken });
    }
  }, [inviteToken]);

  useEffect(() => {
    let isMounted = true;

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const result = await findEventAndConvert(eventUuid);

        if (!isMounted) return;

        if (result.status === 'SUCCESS') {
          dispatch(setGetTogether(result.getTogether));
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
  }, [eventUuid, dispatch]);

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

  // Only render the event details after loading is complete and we have data
  return (
    <div className="h-screen flex flex-col items-center pt-6">
      <h1 className="font-bold text-xl">{name ? name : 'New Rallyvite'}</h1>
      <LocationCarousel locations={locations} />
      <div className="flex w-[90%] flex-col items-center mt-5">
        <h2 className="mb-2">Get-Together Time Option(s)</h2>
        <DateCarousel
          selectedDate={localSelectedDate}
          handleDateChange={handleDateChange}
        />
        <div className="flex flex-row">
          <RSVPTimeGrid
            times={userSelections}
            selectedDate={currentDate}
            availableSlots={{
              '9-0': true,
              '9-15': true,
              '10-30': true,
              '14-0': true,
            }}
            onTimeSubmit={handleSubmit}
          />

          <UserList />
        </div>
      </div>
    </div>
  );
}
