'use client';
import { useEffect, useState } from 'react';
import HolderPFP from '@/assets/9.png';
import ThumbsUp from '@/assets/24-ofcpy.PNG';
import Crying from '@/assets/23-ofcpy.PNG';
import Maybe from '@/assets/25-ofcpy.PNG';
import Image from 'next/image';
import { useBottomActionBar } from '@/context/BottomActionBarContext';
import UpcomingList from '@/components/upcoming/UpcomingList';

const attendanceEmoji = {
  yes: ThumbsUp,
  maybe: Maybe,
  no: Crying,
};

export default function Upcoming() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { setBottomAction } = useBottomActionBar();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserEvents() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/events/user');

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();

        // Transform the backend data to match frontend format
        const transformedEvents = data.map((event) => {
          // Get the first location and its first date/time for display
          const firstLocation = event.locations[0];
          const firstDate = firstLocation?.dates[0];
          const firstTime = firstDate?.times[0];

          return {
            id: event.id.toString(),
            name: event.name,
            location: firstLocation?.name || 'Location TBD',
            date: firstDate
              ? new Date(firstDate.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })
              : 'Date TBD',
            time: firstTime ? firstTime.time : 'Time TBD',
            users: event.users.map((user) => ({
              id: user.user_id.toString(),
              profilePic: HolderPFP, // TODO: Replace with actual user profile pic
              status: user.role.toLowerCase(),
            })),
            messageCount: 0, // TODO: Implement message count from backend
          };
        });

        setEvents(transformedEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setError('Failed to load events. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      setBottomAction({
        label: 'Edit or Chat',
        disabled: false,
        onClick: () => {
          // TODO: Implement navigation to edit/chat view
          console.log('Editing event:', selectedEvent);
        },
      });
    } else {
      setBottomAction({
        label: 'Edit or Chat',
        disabled: true,
        onClick: () => {},
      });
    }
  }, [selectedEvent]);

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center pt-6 px-4 bg-white">
        <p>Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center pt-6 px-4 bg-white">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center pt-6 px-4 overflow-y-auto bg-white">
      <h2 className="font-bold text-xl mb-6">Upcoming Get-Togethers</h2>
      <UpcomingList
        events={events}
        selectedEvent={selectedEvent}
        onEventSelect={handleEventSelect}
      />
    </div>
  );
}
