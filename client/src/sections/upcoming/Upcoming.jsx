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

const mockData = [
  {
    id: '1',
    name: 'Pickleball and Beers',
    location: 'Foothill Club',
    date: 'Friday, March 22',
    time: '3:00pm – 6:00 pm',
    users: [
      { id: 'a1', profilePic: HolderPFP, status: 'yes' },
      { id: 'a2', profilePic: HolderPFP, status: 'yes' },
      { id: 'a3', profilePic: HolderPFP, status: 'yes' },
      { id: 'a4', profilePic: HolderPFP, status: 'no' },
      { id: 'a5', profilePic: HolderPFP, status: 'maybe' },
    ],
    messageCount: 2,
  },
  {
    id: '2',
    name: 'Mahjang and Cocktails',
    location: 'Kelly’s House',
    date: 'Saturday, April 10',
    time: '7:00pm – Whenever',
    users: [
      { id: 'a1', profilePic: HolderPFP, status: 'yes' },
      { id: 'a2', profilePic: HolderPFP, status: 'yes' },
      { id: 'a3', profilePic: HolderPFP, status: 'yes' },
      { id: 'a4', profilePic: HolderPFP, status: 'no' },
      { id: 'a5', profilePic: HolderPFP, status: 'maybe' },
    ],
    messageCount: 17,
  },
];

export default function Upcoming() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { setBottomAction } = useBottomActionBar();

  useEffect(() => {
    async function fetchUserEvents() {
      try {
        // Simulate backend call with mock data
        setTimeout(() => {
          setEvents(mockData);
        }, 500);
      } catch (error) {
        console.error('Failed to fetch events:', error);
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
          // Handle edit action
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
  }, [selectedEvent, setBottomAction]);

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
  };

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
