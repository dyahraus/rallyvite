'use client';
import TimeGrid from './TimeGrid';
import React, { useState, useRef, useEffect } from 'react';
import DateCarousel from './DateCarousel';
import UserList from './UserList';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedDate } from '../../../redux/slices/getTogetherSlice';

export default function GetTogetherTimeOptions() {
  const dispatch = useDispatch();
  const [localSelectedDate, setLocalSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    if (date instanceof Date) {
      setLocalSelectedDate(date);
    }
  };

  // Get the location and selected date times from Redux
  const times = useSelector((state) => {
    console.log('Full Redux State:', state.getTogether);
    const location = state.getTogether.locations.find(
      (loc) => loc.name === state.getTogether.selectedLocation.name
    );
    console.log('Found Location:', location);

    // Normalize the date to midnight UTC for comparison
    const normalizedDate = new Date(localSelectedDate);
    normalizedDate.setUTCHours(0, 0, 0, 0);
    const normalizedDateString = normalizedDate.toISOString();

    const date = location?.dates.find((d) => {
      const existingDate = new Date(d.date);
      existingDate.setUTCHours(0, 0, 0, 0);
      return existingDate.toISOString() === normalizedDateString;
    });
    console.log('Found Date:', date);
    return date?.times || {}; // Return times if found, else an empty object
  });

  console.log('Final times being passed to TimeGrid:', times);

  return (
    <div className="flex w-[90%] flex-col items-center mt-5">
      <h2 className="mb-2">Get-Together Time Option(s)</h2>
      <DateCarousel
        selectedDate={localSelectedDate}
        handleDateChange={handleDateChange}
      />
      <div className="flex flex-row">
        <TimeGrid times={times} selectedDate={localSelectedDate} />
        <UserList />
      </div>
    </div>
  );
}
