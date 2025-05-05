'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useGesture } from '@use-gesture/react';
import { animated, useSpring } from '@react-spring/web';
import { useBottomActionBar } from '@/context/BottomActionBarContext';

export default function RSVPTimeGrid({
  location,
  userTimes,
  times,
  selectedDate,
  setEvent,
  onTimeSelection,
}) {
  console.log('[RSVPTimeGrid] Initial props:', {
    location,
    userTimes,
    times,
    selectedDate,
    hasOnTimeSelection: !!onTimeSelection,
  });

  const { setBottomAction } = useBottomActionBar();

  const handleTimeSubmission = (dateToSave) => {
    console.log(
      '[handleTimeSubmission] Starting submission for date:',
      dateToSave
    );
    console.log(
      '[handleTimeSubmission] Current userSelectedSlots:',
      userSelectedSlots
    );

    // Get all selected time slots with their IDs
    const selectedTimeSlots = Object.entries(userSelectedSlots)
      .filter(([_, isSelected]) => isSelected)
      .map(([timeKey]) => {
        const [hour, minute] = timeKey.split('-');
        const timeString = `${hour.padStart(2, '0')}:${minute.padStart(
          2,
          '0'
        )}:00`;
        const timeSlot = times[timeKey];
        console.log('[handleTimeSubmission] Processing time slot:', {
          timeKey,
          timeString,
          timeSlot,
        });
        return {
          timeKey,
          eventTimeId: timeSlot?.id,
          time: timeString,
        };
      })
      .filter((slot) => slot.eventTimeId);

    console.log(
      '[handleTimeSubmission] Final selectedTimeSlots:',
      selectedTimeSlots
    );

    // Call the parent's onTimeSelection with the selected times
    if (onTimeSelection) {
      console.log('[handleTimeSubmission] Calling onTimeSelection with:', {
        selectedDate: dateToSave.toISOString(),
        selectedTimes: selectedTimeSlots,
      });
      onTimeSelection({
        selectedDate: dateToSave.toISOString(),
        selectedTimes: selectedTimeSlots,
      });
    }

    // Update the event state with selected times
    console.log('[handleTimeSubmission] Updating event state');
    setEvent((prevEvent) => {
      console.log('[handleTimeSubmission] Previous event state:', prevEvent);
      const updatedLocations = prevEvent.locations.map((loc) => {
        if (loc.name !== location.name) return loc;

        const updatedDates = loc.dates.map((dateObj) => {
          const dateNormalized = new Date(dateObj.date);
          dateNormalized.setUTCHours(0, 0, 0, 0);
          const selectedDateNormalized = new Date(dateToSave);
          selectedDateNormalized.setUTCHours(0, 0, 0, 0);

          console.log('[handleTimeSubmission] Comparing dates:', {
            dateNormalized: dateNormalized.toISOString(),
            selectedDateNormalized: selectedDateNormalized.toISOString(),
            isMatch:
              dateNormalized.toISOString() ===
              selectedDateNormalized.toISOString(),
          });

          if (
            dateNormalized.toISOString() ===
            selectedDateNormalized.toISOString()
          ) {
            const updatedDate = {
              ...dateObj,
              userSelectedTimes: selectedTimeSlots.map(
                (slot) => slot.eventTimeId
              ),
            };
            console.log(
              '[handleTimeSubmission] Updated date object:',
              updatedDate
            );
            return updatedDate;
          }

          return dateObj;
        });

        return {
          ...loc,
          dates: updatedDates,
        };
      });

      const newEvent = {
        ...prevEvent,
        locations: updatedLocations,
      };
      console.log('[handleTimeSubmission] New event state:', newEvent);
      return newEvent;
    });
  };

  // Save previous date's slots when date changes
  useEffect(() => {
    if (prevDateRef.current && prevDateRef.current !== selectedDate) {
      console.log('[Date Change Effect] Date changed, saving previous date:', {
        previousDate: prevDateRef.current,
        newDate: selectedDate,
      });
      handleTimeSubmission(prevDateRef.current);
    }
    prevDateRef.current = selectedDate;
  }, [selectedDate]);

  const [userSelectedSlots, setUserSelectedSlots] = useState(userTimes);
  const [selectedSlots, setSelectedSlots] = useState(times);
  const prevDateRef = useRef(selectedDate);
  const userSelectedSlotsRef = useRef(userSelectedSlots);

  useEffect(() => {
    console.log(
      '[userSelectedSlotsRef Effect] Updating ref:',
      userSelectedSlots
    );
    userSelectedSlotsRef.current = userSelectedSlots;
  }, [userSelectedSlots]);

  // Update selectedSlots when times changes
  useEffect(() => {
    console.log('[Times Change Effect] Times prop changed:', {
      oldTimes: selectedSlots,
      newTimes: times,
    });
    setSelectedSlots(times);
  }, [times]);

  // Update userSelectedSlots when userTimes changes
  useEffect(() => {
    console.log('[UserTimes Change Effect] UserTimes prop changed:', {
      oldTimes: userSelectedSlots,
      newTimes: userTimes,
    });
    setUserSelectedSlots(userTimes);
  }, [userTimes]);

  // Only update local state when user makes changes
  const toggleUserSlotSelection = (hour, minute) => {
    const key = slotKey(hour, minute);
    console.log('[toggleUserSlotSelection] Toggling slot:', {
      hour,
      minute,
      key,
      currentState: userSelectedSlots[key],
      timeSlot: times[key],
    });
    setUserSelectedSlots((prev) => {
      const newState = {
        ...prev,
        [key]: !prev[key],
      };
      console.log('[toggleUserSlotSelection] New state:', newState);
      return newState;
    });
  };

  const gridRef = useRef(null);
  const [isDraggingSlots, setIsDraggingSlots] = useState(false);
  const dragTimeout = useRef(null);
  const [scrollRatio, setScrollRatio] = useState(0);
  const draggedSlots = useRef(new Set());

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  const slotKey = (hour, minute) => `${hour}-${minute}`;

  const isHourSelected = (hour) =>
    minutes.some((minute) => selectedSlots[slotKey(hour, minute)]);

  const isHourUserSelected = (hour) =>
    minutes.some((minute) => userSelectedSlots[slotKey(hour, minute)]);

  const formattedHour = (hour) => {
    if (hour === 0) return 12;
    if (hour === 12) return 12;
    return hour > 12 ? hour - 12 : hour;
  };

  const period = (hour) => (hour < 12 ? 'A' : 'P');

  // Scroll handling
  const handleScroll = () => {
    const grid = gridRef.current;
    const ratio = grid.scrollTop / (grid.scrollHeight - grid.clientHeight);
    setScrollRatio(ratio);
  };

  // Animated scrollbar thumb
  const thumbSpring = useSpring({
    top: `calc(${scrollRatio * 100}% - 10px)`,
  });

  // Slot selection handlers
  const handlePointerDown = (e) => {
    const target = e.target.closest('[data-slot]');
    if (!target) return;

    const [h, m] = target.dataset.slot.split('-').map(Number);
    console.log('[TimeGrid] Pointer down on slot:', { hour: h, minute: m });

    dragTimeout.current = setTimeout(() => {
      console.log('[TimeGrid] Starting drag selection');
      setIsDraggingSlots(true);
      draggedSlots.current = new Set();
      const key = slotKey(h, m);
      draggedSlots.current.add(key);
      toggleUserSlotSelection(h, m);
    }, 400);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingSlots) return;

    const touch = e.touches?.[0] || e;
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const dataSlot = target?.getAttribute('data-slot');
    if (dataSlot && !draggedSlots.current.has(dataSlot)) {
      const [h, m] = dataSlot.split('-').map(Number);
      console.log('[TimeGrid] Dragging over slot:', { hour: h, minute: m });
      draggedSlots.current.add(dataSlot);
      toggleUserSlotSelection(h, m);
    }
  };

  const handlePointerUp = () => {
    console.log('[TimeGrid] Pointer up, ending drag selection');
    clearTimeout(dragTimeout.current);
    setIsDraggingSlots(false);
  };

  // Scrollbar thumb drag behavior
  const bindThumbDrag = useGesture({
    onDrag: ({ movement: [, my], last }) => {
      const grid = gridRef.current;
      const maxScroll = grid.scrollHeight - grid.clientHeight;
      const newScroll = scrollRatio * maxScroll + my;
      grid.scrollTop = Math.min(maxScroll, Math.max(0, newScroll));
      if (last) handleScroll();
    },
  });

  useEffect(() => {
    console.log('[Bottom Action Effect] Setting up bottom action');
    setBottomAction({
      label: 'Continue',
      disabled: false,
      onClick: () => {
        console.log(
          '[Bottom Action Click] Storing selected slots:',
          userSelectedSlotsRef.current
        );
        handleTimeSubmission(selectedDate);
      },
    });
  }, [selectedDate]);

  return (
    <div className="relative flex w-[60%] max-w-md h-96 mt-4 shadow-sm">
      <div
        ref={gridRef}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="flex-1 overflow-y-auto border border-black scrollbar-none"
      >
        {hours.map((hour) => (
          <div
            key={hour}
            className="flex w-full items-center border-b border-black"
          >
            <div
              className={`w-14 h-32 flex items-center justify-center border border-gray-200 font-bold text-5xl ${
                isHourUserSelected(hour)
                  ? 'bg-rallyBlue'
                  : isHourSelected(hour)
                  ? 'bg-rallyYellow'
                  : 'bg-gray-100 cursor-not-allowed opacity-50'
              }`}
            >
              {formattedHour(hour)}
            </div>

            <div className="flex-1 grid grid-rows-4 divide-y divide-gray-300">
              {minutes.map((minute) => {
                const timeKey = slotKey(hour, minute);
                const timeSlot = times[timeKey];
                return (
                  <div
                    key={timeKey}
                    data-slot={timeKey}
                    data-time-id={timeSlot?.id}
                    className={`h-8 flex items-center justify-center text-xs cursor-pointer select-none text-black ${
                      userSelectedSlots[timeKey]
                        ? 'bg-rallyBlue'
                        : selectedSlots[timeKey]
                        ? 'bg-rallyYellow'
                        : 'bg-gray-100 cursor-not-allowed opacity-50'
                    }`}
                    onClick={() => {
                      if (selectedSlots[timeKey]) {
                        toggleUserSlotSelection(hour, minute);
                      }
                    }}
                  >
                    {minute === 0 ? ':00' : `:${minute}`}
                  </div>
                );
              })}
            </div>

            <div
              className={`w-14 h-32 flex items-center justify-center border border-gray-200 font-bold text-5xl ${
                isHourUserSelected(hour)
                  ? 'bg-rallyBlue'
                  : isHourSelected(hour)
                  ? 'bg-rallyYellow'
                  : 'bg-gray-100 cursor-not-allowed opacity-50'
              }`}
            >
              {period(hour)}
            </div>
          </div>
        ))}
      </div>

      <div className="w-5 relative">
        <div className="absolute top-0 left-3 w-1 bg-gray-300 h-full rounded"></div>
        <animated.div
          {...bindThumbDrag()}
          className="absolute left-1.5 w-4 h-10 bg-rallyBlue rounded-full cursor-pointer flex items-center justify-center text-rallyYellow font-bold text-sm"
          style={thumbSpring}
        >
          {formattedHour(Math.floor(scrollRatio * 24))}
        </animated.div>
      </div>
    </div>
  );
}
