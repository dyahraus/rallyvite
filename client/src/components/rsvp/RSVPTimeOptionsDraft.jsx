'use client';
import RSVPTimeGrid from './RSVPTimeGridDraft';
import RSVPDateCarousel from './RSVPDateCarousel';
import React, { useState, useRef, useEffect } from 'react';
import RSVPUserList from '@/components/rsvp/RSVPUserList';
import { useSelector, useDispatch } from 'react-redux';

export default function RSVPTimeOptions({ location, setEvent, event }) {
  const [localSelectedDate, setLocalSelectedDate] = useState(new Date());
  const prevDateRef = useRef(localSelectedDate);

  const locationDates = location.dates.map((d) => new Date(d.date));

  const handleDateChange = (date) => {
    if (date instanceof Date) {
      setLocalSelectedDate(date);
    }
  };

  const handleTimeSelection = (selection) => {
    console.log('[RSVPOptions] Received selection:', selection);
    const { selectedDate, selectedTimes } = selection;

    // Update final state in event object
    setEvent((prevEvent) => {
      const updatedLocations = prevEvent.locations.map((loc) => {
        if (loc.name !== location.name) return loc;

        const updatedDates = loc.dates.map((dateObj) => {
          const normalizedDate = new Date(dateObj.date);
          normalizedDate.setUTCHours(0, 0, 0, 0);
          const selectedDateNorm = new Date(selectedDate);
          selectedDateNorm.setUTCHours(0, 0, 0, 0);

          if (normalizedDate.toISOString() === selectedDateNorm.toISOString()) {
            return {
              ...dateObj,
              userSelectedTimes: selectedTimes.map((slot) => slot.eventTimeId),
            };
          }
          return dateObj;
        });

        return {
          ...loc,
          dates: updatedDates,
        };
      });

      return {
        ...prevEvent,
        locations: updatedLocations,
      };
    });
  };

  const EMPTY_TIMES = {};

  const getOrganizerTimes = (location) => {
    const normalizedDate = new Date(localSelectedDate);
    normalizedDate.setUTCHours(0, 0, 0, 0);
    const normalizedDateString = normalizedDate.toISOString();

    const date = location?.dates.find((d) => {
      const existingDate = new Date(d.date);
      existingDate.setUTCHours(0, 0, 0, 0);
      return existingDate.toISOString() === normalizedDateString;
    });

    const timesArray = date?.times || [];

    // Convert array to { '9-0': { id: 1, time: '09:00:00' }, ... } format
    const timesObject = timesArray.reduce((acc, time) => {
      const [hour, minute] = time.time.split(':').map(Number);
      const key = `${hour}-${minute}`;
      acc[key] = {
        id: time.id,
        time: time.time,
      };
      return acc;
    }, {});

    return timesObject;
  };

  const organizerTimes = getOrganizerTimes(location);

  const getUserTimes = (location) => {
    const normalizedDate = new Date(localSelectedDate);
    normalizedDate.setUTCHours(0, 0, 0, 0);
    const normalizedDateString = normalizedDate.toISOString();

    const date = location?.dates.find((d) => {
      const existingDate = new Date(d.date);
      existingDate.setUTCHours(0, 0, 0, 0);
      return existingDate.toISOString() === normalizedDateString;
    });

    const selectedIds = date?.userSelectedTimes || [];

    // Map selected time IDs to { 'hour-minute': true } using the `times` map
    const timeMap = (date?.times || []).reduce((acc, time) => {
      const [hour, minute] = time.time.split(':').map(Number);
      const key = `${hour}-${minute}`;
      if (selectedIds.includes(time.id)) {
        acc[key] = true;
      }
      return acc;
    }, {});

    return timeMap;
  };

  const userTimes = getUserTimes(location);

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
          location={location}
          setEvent={setEvent}
          times={organizerTimes}
          userTimes={userTimes}
          selectedDate={localSelectedDate}
          onTimeSelection={handleTimeSelection}
        />
        <RSVPUserList event={event} />
      </div>
    </div>
  );
}
