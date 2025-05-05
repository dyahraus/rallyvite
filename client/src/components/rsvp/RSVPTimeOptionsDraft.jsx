'use client';
import RSVPTimeGrid from './RSVPTimeGridDraft';
import RSVPDateCarousel from './RSVPDateCarousel';
import React, { useState, useRef, useEffect } from 'react';
import RSVPUserList from '@/components/rsvp/RSVPUserList';
import { useSelector, useDispatch } from 'react-redux';

export default function RSVPTimeOptions({
  location,
  setEvent,
  setTimeSelections,
  event,
}) {
  console.log('[RSVPTimeOptions] Initial props:', {
    location,
    hasSetEvent: !!setEvent,
  });

  const [localSelectedDate, setLocalSelectedDate] = useState(new Date());
  const prevDateRef = useRef(localSelectedDate);

  const locationDates = location.dates.map((d) => new Date(d.date));
  console.log('[RSVPTimeOptions] Available location dates:', locationDates);

  const handleDateChange = (date) => {
    console.log('[RSVPTimeOptions] Date change requested:', {
      oldDate: localSelectedDate,
      newDate: date,
    });
    if (date instanceof Date) {
      setLocalSelectedDate(date);
    }
  };

  const handleTimeSelection = (selection) => {
    console.log('[RSVPTimeOptions] Received time selection:', selection);
    const { selectedDate, selectedTimes } = selection;

    // Update time selections state
    setTimeSelections((prev) => ({
      ...prev,
      [selectedDate]: selectedTimes,
    }));

    // Update event state with the new selections
    setEvent((prevEvent) => {
      const updatedLocations = prevEvent.locations.map((loc) => {
        if (loc.name !== location.name) return loc;

        const updatedDates = loc.dates.map((dateObj) => {
          const dateNormalized = new Date(dateObj.date);
          dateNormalized.setUTCHours(0, 0, 0, 0);
          const selectedDateNormalized = new Date(selectedDate);
          selectedDateNormalized.setUTCHours(0, 0, 0, 0);

          if (
            dateNormalized.toISOString() ===
            selectedDateNormalized.toISOString()
          ) {
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

  // Save previous date's selections when date changes
  useEffect(() => {
    if (prevDateRef.current && prevDateRef.current !== localSelectedDate) {
      console.log('[Date Change Effect] Date changed, saving previous date:', {
        previousDate: prevDateRef.current,
        newDate: localSelectedDate,
      });
      handleTimeSelection({
        selectedDate: prevDateRef.current.toISOString(),
        selectedTimes: timeSelections[prevDateRef.current.toISOString()] || [],
      });
    }
    prevDateRef.current = localSelectedDate;
  }, [localSelectedDate]);

  const EMPTY_TIMES = {};

  const getOrganizerTimes = (location) => {
    const normalizedDate = new Date(localSelectedDate);
    normalizedDate.setUTCHours(0, 0, 0, 0);
    const normalizedDateString = normalizedDate.toISOString();

    console.log('[RSVPTimeOptions] Finding organizer times for date:', {
      normalizedDateString,
      locationDates: location.dates,
    });

    const date = location?.dates.find((d) => {
      const existingDate = new Date(d.date);
      existingDate.setUTCHours(0, 0, 0, 0);
      return existingDate.toISOString() === normalizedDateString;
    });

    console.log(
      '[RSVPTimeOptions] Found date object for organizer times:',
      date
    );
    const timesArray = date?.times || [];
    console.log('[RSVPTimeOptions] Times array:', timesArray);

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

    console.log('[RSVPTimeOptions] Converted times object:', timesObject);
    return timesObject;
  };

  const organizerTimes = getOrganizerTimes(location);
  console.log(
    '[RSVPTimeOptions] Current organizer times being passed to TimeGrid:',
    organizerTimes
  );

  // Get the user's selections for the current date
  const getUserTimes = (location) => {
    const normalizedDate = new Date(localSelectedDate);
    normalizedDate.setUTCHours(0, 0, 0, 0);
    const normalizedDateString = normalizedDate.toISOString();

    const date = location?.dates.find((d) => {
      const existingDate = new Date(d.date);
      existingDate.setUTCHours(0, 0, 0, 0);
      return existingDate.toISOString() === normalizedDateString;
    });

    return date?.userSelectedTimes || EMPTY_TIMES;
  };

  const userTimes = getUserTimes(location);
  console.log(
    '[RSVPTimeOptions] Current user times being passed to TimeGrid:',
    userTimes
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
