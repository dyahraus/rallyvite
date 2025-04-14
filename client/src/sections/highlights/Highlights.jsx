'use client';
import { useEffect, useState } from 'react';
import HolderPFP from '@/assets/9.png';
import ThumbsUp from '@/assets/24-ofcpy.PNG';
import Crying from '@/assets/23-ofcpy.PNG';
import Maybe from '@/assets/25-ofcpy.PNG';
import Image from 'next/image';
import { useBottomActionBar } from '@/context/BottomActionBarContext';
import UpcomingList from '@/components/upcoming/UpcomingList';
import EditingEvent from '@/components/highlights/EditingEvent';

export default function Highlights() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { setBottomAction } = useBottomActionBar();
  const [showEditingEvent, setShowEditingEvent] = useState(false);

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
    if (showEditingEvent) {
      setBottomAction({
        label: 'View All Highlights',
        disabled: false,
        onClick: () => {
          setShowEditingEvent(false);
          setSelectedEvent(null);
        },
      });
    } else if (selectedEvent) {
      setBottomAction({
        label: 'View Chat and Photos',
        disabled: false,
        onClick: () => {
          setShowEditingEvent(true);
        },
      });
    } else {
      setBottomAction({
        label: 'View Chat and Photos',
        disabled: true,
        onClick: () => {},
      });
    }
  }, [selectedEvent, setBottomAction, showEditingEvent]);

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseEditing = () => {
    setShowEditingEvent(false);
    setSelectedEvent(null);
  };

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

  return (
    <div className="h-screen flex flex-col items-center pt-6 px-4 overflow-y-auto bg-white">
      <h2 className="font-bold text-xl mb-6">Highlights</h2>
      {showEditingEvent ? (
        <EditingEvent event={selectedEvent} onClose={handleCloseEditing} />
      ) : (
        <UpcomingList
          events={events}
          selectedEvent={selectedEvent}
          onEventSelect={handleEventSelect}
        />
      )}
    </div>
  );
}
