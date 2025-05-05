'use client';
import RSVPTimeGrid from './RSVPTimeGrid';
import RSVPDateCarousel from './RSVPDateCarousel';
import React, { useState, useRef, useEffect } from 'react';
import UserList from '@/components/new/pollLocationTime/UserList';
import { useSelector, useDispatch } from 'react-redux';

export default function RSVPTimeOptions({ eventUuid, location }) {
  console.log('[TimeOptions] Component mounted with props:', {
    eventUuid,
    location,
  });

  const [localSelectedDate, setLocalSelectedDate] = useState(new Date());
  console.log('[TimeOptions] Initial localSelectedDate:', localSelectedDate);

  const locationDates = location.dates.map((d) => d.date);
  console.log('[TimeOptions] Available location dates:', locationDates);

  const handleDateChange = (date) => {
    console.log('[TimeOptions] Date change requested:', {
      oldDate: localSelectedDate,
      newDate: date,
    });
    if (date instanceof Date) {
      setLocalSelectedDate(date);
    }
  };

  const EMPTY_TIMES = {};

  const organizerTimes = (location) => {
    // Normalize the date to midnight UTC for comparison
    const normalizedDate = new Date(localSelectedDate);
    normalizedDate.setUTCHours(0, 0, 0, 0);
    const normalizedDateString = normalizedDate.toISOString();

    console.log('[TimeOptions] Finding times for date:', {
      normalizedDateString,
      locationDates: location.dates,
    });

    const date = location?.dates.find((d) => {
      const existingDate = new Date(d.date);
      existingDate.setUTCHours(0, 0, 0, 0);
      return existingDate.toISOString() === normalizedDateString;
    });

    console.log('[TimeOptions] Found date object:', date);
    const times = date?.times || EMPTY_TIMES;
    console.log('[TimeOptions] Returning times:', times);
    return times;
  };

  const currentTimes = organizerTimes(location);
  console.log(
    '[TimeOptions] Current times being passed to TimeGrid:',
    currentTimes
  );

  return (
    <div className="flex w-[90%] flex-col items-center mt-5">
      <h2 className="mb-2">Get-Together Time Option(s)</h2>
      <RSVPDateCarousel
        selectedDate={localSelectedDate}
        handleDateChange={handleDateChange}
        locationDates={locationDates}
      />
      <div className="flex flex-row">
        <RSVPTimeGrid
          eventUuid={eventUuid}
          location={location}
          times={currentTimes}
          userTimes={userTimes}
          selectedDate={localSelectedDate}
        />
        <UserList />
      </div>
    </div>
  );
}
