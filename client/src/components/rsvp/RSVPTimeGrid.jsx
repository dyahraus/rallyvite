'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUserTimes } from '@/redux/slices/eventsSlice';
import { useGesture } from '@use-gesture/react';
import { animated, useSpring } from '@react-spring/web';

export default function RSVPTimeGrid({
  eventUuid,
  location,
  userTimes,
  times,
  selectedDate,
}) {
  console.log('[TimeGrid] Component mounted with props:', {
    eventUuid,
    location,
    userTimes,
    times,
    selectedDate,
  });

  const dispatch = useDispatch();
  const [userSelectedSlots, setUserSelectedSlots] = useState(userTimes);
  const [selectedSlots, setSelectedSlots] = useState(times);
  const prevDateRef = useRef(selectedDate);
  console.log('TimeGrid received times:', times);
  console.log('TimeGrid selectedSlots state:', selectedSlots);

  // UPDATE TODO RSVP
  const handleTimeSubmission = (dateToSave) => {
    console.log('[TimeGrid] Submitting times to Redux:', {
      dateToSave,
      selectedSlots,
      eventUuid,
      location,
    });
    dispatch(
      setUserTimes({
        selectedDate: dateToSave.toISOString(),
        selectedSlots,
        eventUuid,
        selectedLoction: location,
      })
    );
  };

  // Update selectedSlots when times changes
  useEffect(() => {
    console.log('[TimeGrid] Times prop changed:', {
      oldTimes: selectedSlots,
      newTimes: times,
    });
    setSelectedSlots(times);
  }, [times]);

  // Update userSelectedSlots when times changes
  useEffect(() => {
    console.log('[TimeGrid] UserTimes prop changed:', {
      oldUserTimes: userSelectedSlots,
      newUserTimes: userTimes,
    });
    setUserSelectedSlots(userTimes);
  }, [userTimes]);

  // Save previous date's slots when date changes
  useEffect(() => {
    if (prevDateRef.current && prevDateRef.current !== selectedDate) {
      console.log('[TimeGrid] Date changed, saving previous date:', {
        previousDate: prevDateRef.current,
        newDate: selectedDate,
      });
      handleTimeSubmission(prevDateRef.current);
    }
    prevDateRef.current = selectedDate;
  }, [selectedDate]);

  // Only update local state when user makes changes
  const toggleUserSlotSelection = (hour, minute) => {
    const key = slotKey(hour, minute);

    // ✅ Only allow toggling if the slot is selectable
    if (!selectedSlots[key]) {
      console.log(`[TimeGrid] Slot ${key} is not selectable.`);
      return;
    }

    console.log('[TimeGrid] Toggling slot selection:', {
      hour,
      minute,
      key,
      currentState: userSelectedSlots[key],
    });
    setUserSelectedSlots((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const gridRef = useRef(null);
  const [isDraggingSlots, setIsDraggingSlots] = useState(false);
  const dragTimeout = useRef(null);
  const [scrollRatio, setScrollRatio] = useState(0);
  const draggedSlots = useRef(new Set());
  const isInitialMount = useRef(true);
  const hasInitialized = useRef(false);

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
    const key = slotKey(h, m);

    // ✅ Only start drag if slot is selectable
    if (!selectedSlots[key]) return;

    console.log('[TimeGrid] Pointer down on slot:', { hour: h, minute: m });

    dragTimeout.current = setTimeout(() => {
      console.log('[TimeGrid] Starting drag selection');
      setIsDraggingSlots(true);
      draggedSlots.current = new Set();
      draggedSlots.current.add(key);
      toggleUserSlotSelection(h, m);
    }, 400);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingSlots) return;

    const touch = e.touches?.[0] || e;
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const dataSlot = target?.getAttribute('data-slot');
    if (!dataSlot || draggedSlots.current.has(dataSlot)) return;

    const [h, m] = dataSlot.split('-').map(Number);
    const key = slotKey(h, m);

    // ✅ Only allow toggling if it's a selectable slot
    if (!selectedSlots[key]) return;

    console.log('[TimeGrid] Dragging over slot:', { hour: h, minute: m });
    draggedSlots.current.add(dataSlot);
    toggleUserSlotSelection(h, m);
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
              {minutes.map((minute) => (
                <div
                  key={minute}
                  className={`h-8 flex items-center justify-center text-xs cursor-pointer select-none text-black ${
                    userSelectedSlots[slotKey(hour, minute)]
                      ? 'bg-rallyBlue'
                      : selectedSlots[slotKey(hour, minute)]
                      ? 'bg-rallyYellow'
                      : 'bg-gray-100 cursor-not-allowed opacity-50'
                  }`}
                  data-slot={`${hour}-${minute}`}
                  onClick={() => {
                    if (selectedSlots[slotKey(hour, minute)]) {
                      toggleUserSlotSelection(hour, minute);
                    }
                  }}
                >
                  {minute === 0 ? ':00' : `:${minute}`}
                </div>
              ))}
            </div>

            <div
              className={`w-14 h-32 flex items-center justify-center border border-gray-200 font-bold text-5xl ${
                isHourUserSelected(hour)
                  ? 'bg-rallyBlue'
                  : isHourSelected(hour)
                  ? 'bg-rallyYellow'
                  : ''
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
