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
  onTimeSelection,
}) {
  console.log('TIMES: ', times);
  console.log('USERTIMES: ', userTimes);
  const prevDateRef = useRef(selectedDate);
  const prevLocationRef = useRef(location.name);
  const prevTimesRef = useRef(times);

  // // Handles date or location changes
  // useEffect(() => {
  //   const dateChanged = prevDateRef.current !== selectedDate;
  //   const locationChanged = prevLocationRef.current !== location.name;

  //   if (dateChanged || locationChanged) {
  //     handleTimeSubmission(prevDateRef.current, prevTimesRef.current);
  //   }

  //   prevDateRef.current = selectedDate;
  //   prevLocationRef.current = location.name;
  //   prevTimesRef.current = times;
  // }, [selectedDate, location.name, times]);

  useEffect(() => {
    const dateChanged = prevDateRef.current !== selectedDate;
    const locationChanged = prevLocationRef.current !== location.name;

    // Submit previous selections if date or location changed
    if (
      (dateChanged || locationChanged) &&
      prevDateRef.current &&
      prevLocationRef.current
    ) {
      handleTimeSubmission(prevDateRef.current, prevTimesRef.current);
    }

    // Load new selections
    setUserSelectedSlots(userTimes);
    userSelectedSlotsRef.current = userTimes;

    // Update refs
    prevDateRef.current = selectedDate;
    prevLocationRef.current = location.name;
    prevTimesRef.current = times;
  }, [selectedDate, location.name, userTimes, times]);

  // useEffect(() => {
  //   console.log(
  //     '[useEffect] prevDateRef.current:',
  //     prevDateRef.current.toISOString()
  //   );
  //   console.log('[useEffect] selectedDate:', selectedDate.toISOString());

  //   const dateChanged = prevDateRef.current !== selectedDate;
  //   const locationChanged = prevLocationRef.current !== location.name;

  //   if (dateChanged || locationChanged) {
  //     handleTimeSubmission(prevDateRef.current);
  //   }

  //   prevDateRef.current = selectedDate;
  //   prevLocationRef.current = location.name;
  // }, [selectedDate, location.name]);

  const { setBottomAction } = useBottomActionBar();

  useEffect(() => {
    setUserSelectedSlots(userTimes); // comes from parent
  }, [userTimes, selectedDate, location.name]);

  // useEffect(() => {
  //   if (prevDateRef.current && prevDateRef.current !== selectedDate) {
  //     handleTimeSubmission(prevDateRef.current, prevTimesRef.current);
  //   }
  //   prevDateRef.current = selectedDate;
  //   prevTimesRef.current = times;
  // }, [selectedDate, times]);

  const handleTimeSubmission = (dateToSave, timesMap) => {
    const selectedTimeSlots = Object.entries(userSelectedSlotsRef.current)
      .filter(([_, isSelected]) => isSelected)
      .map(([timeKey]) => {
        const [hour, minute] = timeKey.split('-');
        const timeString = `${hour.padStart(2, '0')}:${minute.padStart(
          2,
          '0'
        )}:00`;
        const timeSlot = timesMap[timeKey];
        return {
          timeKey,
          eventTimeId: timeSlot?.id,
          time: timeString,
        };
      })
      .filter((slot) => slot.eventTimeId);

    console.log('[handleTimeSubmission]', {
      dateToSave,
      selectedTimeSlots,
    });

    onTimeSelection?.({
      selectedDate: dateToSave.toISOString(),
      selectedTimes: selectedTimeSlots,
    });
  };

  // Save previous date's slots when date changes
  useEffect(() => {
    if (prevDateRef.current && prevDateRef.current !== selectedDate) {
      handleTimeSubmission(prevDateRef.current);
    }
    prevDateRef.current = selectedDate;
  }, [selectedDate]);

  const [userSelectedSlots, setUserSelectedSlots] = useState(userTimes);
  const [selectedSlots, setSelectedSlots] = useState(times);
  const userSelectedSlotsRef = useRef(userSelectedSlots);

  useEffect(() => {
    userSelectedSlotsRef.current = userSelectedSlots;
  }, [userSelectedSlots]);

  // Update selectedSlots when times changes
  useEffect(() => {
    setSelectedSlots(times);
  }, [times]);

  // Update userSelectedSlots when userTimes changes
  useEffect(() => {
    setUserSelectedSlots(userTimes);
  }, [userTimes]);

  // Only update local state when user makes changes
  const toggleUserSlotSelection = (hour, minute) => {
    const key = slotKey(hour, minute);
    setUserSelectedSlots((prev) => {
      const newState = {
        ...prev,
        [key]: !prev[key],
      };
      console.log('NEW STATE: ', newState);
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

    dragTimeout.current = setTimeout(() => {
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
      draggedSlots.current.add(dataSlot);
      toggleUserSlotSelection(h, m);
    }
  };

  const handlePointerUp = () => {
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
    setBottomAction({
      label: 'Continue',
      disabled: false,
      onClick: () => {
        handleTimeSubmission(selectedDate, times);
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
