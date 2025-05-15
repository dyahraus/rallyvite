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
  setCurrentStep,
  setResponse,
}) {
  console.log('TIMES: ', times);
  console.log('USERTIMES: ', userTimes);
  const prevDateRef = useRef(selectedDate);
  const prevLocationRef = useRef(location.name);
  const prevTimesRef = useRef(times);

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
  const { setBottomAction } = useBottomActionBar();

  useEffect(() => {
    setUserSelectedSlots(userTimes); // comes from parent
  }, [userTimes, selectedDate, location.name]);

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

    // Create a new date object at midnight UTC while preserving the local date
    const localDate = new Date(dateToSave);
    const normalized = new Date(
      Date.UTC(
        localDate.getUTCFullYear(),
        localDate.getUTCMonth(),
        localDate.getUTCDate()
      )
    );

    console.log('[handleTimeSubmission]', {
      dateToSave,
      selectedTimeSlots,
      normalized,
    });

    onTimeSelection?.({
      selectedDate: normalized.toISOString(),
      selectedTimes: selectedTimeSlots,
      locationName: prevLocationRef.current ?? location.name,
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

  // DRAG AND DROP FUNCTION
  const pointerYRef = useRef(null); // latest Y position
  const autoScrollRef = useRef(null); // requestAnimationFrame ref

  const SCROLL_ZONE_HEIGHT = 40; // px from top or bottom to trigger scroll
  const SCROLL_SPEED = 3; // px per frame

  const autoScroll = () => {
    const grid = gridRef.current;
    const pointerY = pointerYRef.current;
    if (!grid || pointerY == null) return;

    const { top, bottom } = grid.getBoundingClientRect();

    if (pointerY - top < SCROLL_ZONE_HEIGHT) {
      grid.scrollTop -= SCROLL_SPEED;
    } else if (bottom - pointerY < SCROLL_ZONE_HEIGHT) {
      grid.scrollTop += SCROLL_SPEED;
    }

    autoScrollRef.current = requestAnimationFrame(autoScroll);
  };

  useEffect(() => {
    const handleTouchMove = (e) => {
      if (isDraggingSlots) {
        e.preventDefault(); // Prevent scroll while drag-selecting
      }
    };

    const grid = gridRef.current;
    if (grid) {
      grid.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      if (grid) {
        grid.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [isDraggingSlots]);

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
    const key = slotKey(h, m);
    if (!times[key]) return; // ⛔️ Prevent dragging on unavailable slot

    dragTimeout.current = setTimeout(() => {
      setIsDraggingSlots(true);
      draggedSlots.current = new Set();
      draggedSlots.current.add(key);
      toggleUserSlotSelection(h, m);
    }, 400);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingSlots) return;

    const touch = e.touches?.[0] || e;
    pointerYRef.current = touch.clientY;

    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const dataSlot = target?.getAttribute('data-slot');
    if (dataSlot && !draggedSlots.current.has(dataSlot)) {
      const [h, m] = dataSlot.split('-').map(Number);
      const key = slotKey(h, m);
      if (!times[key]) return; // ⛔️ Skip if not a valid organizer slot

      draggedSlots.current.add(key);
      toggleUserSlotSelection(h, m);
    }

    if (!autoScrollRef.current) {
      autoScrollRef.current = requestAnimationFrame(autoScroll);
    }
  };

  const handlePointerUp = () => {
    clearTimeout(dragTimeout.current);
    setIsDraggingSlots(false);
    draggedSlots.current.clear();
    pointerYRef.current = null;

    if (autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current);
      autoScrollRef.current = null;
    }
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
        setCurrentStep(2);
        setResponse('yes');
      },
    });
  }, [selectedDate]);

  return (
    <div className="relative flex w-[95%] max-w-md h-72 mt-1 shadow-sm">
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
              className={`w-12 h-28 flex flex-col items-center justify-center border border-gray-200 ${
                isHourUserSelected(hour)
                  ? 'bg-rallyBlue'
                  : isHourSelected(hour)
                  ? 'bg-rallyYellow text-black'
                  : 'bg-gray-100 text-black opacity-50'
              }`}
            >
              <div className="text-4xl font-bold leading-none">
                {formattedHour(hour)}
              </div>
              <div className="text-sm font-semibold text-gray-600 mt-1">
                {period(hour) === 'A' ? 'AM' : 'PM'}
              </div>
            </div>

            <div className="flex-1 min-w-0 grid grid-rows-4 divide-y divide-gray-300">
              {minutes.map((minute) => {
                const timeKey = slotKey(hour, minute);
                const timeSlot = times[timeKey];
                const isSelected = userSelectedSlots[timeKey];
                const isAvailable = selectedSlots[timeKey];

                return (
                  <div
                    key={timeKey}
                    data-slot={timeKey}
                    data-time-id={timeSlot?.id}
                    className={`h-7 flex items-center justify-center text-xs font-semibold cursor-pointer select-none text-black ${
                      isSelected
                        ? 'bg-rallyBlue'
                        : isAvailable
                        ? 'bg-rallyYellow'
                        : 'bg-gray-100 cursor-not-allowed opacity-50'
                    }`}
                    onClick={() => {
                      if (isAvailable) toggleUserSlotSelection(hour, minute);
                    }}
                  >
                    {minute === 0 ? ':00' : `:${minute}`}
                  </div>
                );
              })}
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
