'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTimes } from '../../../redux/slices/getTogetherSlice';
import { useGesture } from '@use-gesture/react';
import { animated, useSpring } from '@react-spring/web';
import { useBottomActionBar } from '@/context/BottomActionBarContext';

export default function TimeGrid({ times, selectedDate, setCurrentStep }) {
  const dispatch = useDispatch();
  const [selectedSlots, setSelectedSlots] = useState(times);
  const prevDateRef = useRef(selectedDate);
  const selectedSlotsRef = useRef(selectedSlots);

  useEffect(() => {
    selectedSlotsRef.current = selectedSlots;
  }, [selectedSlots]);

  console.log('TimeGrid received times:', times);
  console.log('TimeGrid selectedSlots state:', selectedSlots);

  const { setBottomAction } = useBottomActionBar();

  const handleTimeSubmission = (dateToSave) => {
    console.log('Submitting times to Redux:', selectedSlots);
    dispatch(
      setTimes({
        selectedDate: dateToSave.toISOString(),
        selectedSlots,
      })
    );
  };

  // Update selectedSlots when times changes
  useEffect(() => {
    console.log('TimeGrid useEffect triggered with new times:', times);
    setSelectedSlots(times);
  }, [times]);

  // Save previous date's slots when date changes
  useEffect(() => {
    if (prevDateRef.current && prevDateRef.current !== selectedDate) {
      handleTimeSubmission(prevDateRef.current);
    }
    prevDateRef.current = selectedDate;
  }, [selectedDate]);

  // Only update local state when user makes changes
  const toggleSlotSelection = (hour, minute) => {
    const key = slotKey(hour, minute);
    console.log('Selected slot:', key);
    setSelectedSlots((prev) => ({
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
    console.log('Pointer down on slot:', { hour: h, minute: m });

    dragTimeout.current = setTimeout(() => {
      console.log('Starting drag selection');
      setIsDraggingSlots(true);
      draggedSlots.current = new Set();
      const key = slotKey(h, m);
      draggedSlots.current.add(key);
      toggleSlotSelection(h, m);
    }, 400);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingSlots) return;

    const touch = e.touches?.[0] || e;
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const dataSlot = target?.getAttribute('data-slot');
    if (dataSlot && !draggedSlots.current.has(dataSlot)) {
      const [h, m] = dataSlot.split('-').map(Number);
      console.log('Dragging over slot:', { hour: h, minute: m });
      draggedSlots.current.add(dataSlot);
      toggleSlotSelection(h, m);
    }
  };

  const handlePointerUp = () => {
    console.log('Pointer up, ending drag selection');
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
    console.log('COMPONENT RERENDERED');
    setBottomAction({
      label: 'Continue',
      disabled: false,
      onClick: () => {
        console.log(
          'BottomAction clicked, using latest selected slots:',
          selectedSlotsRef.current
        );
        dispatch(
          setTimes({
            selectedDate: prevDateRef.current.toISOString(),
            selectedSlots: selectedSlotsRef.current,
          })
        );
        setCurrentStep(3);
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
                isHourSelected(hour) ? 'bg-rallyYellow' : ''
              }`}
            >
              {formattedHour(hour)}
            </div>

            <div className="flex-1 grid grid-rows-4 divide-y divide-gray-300">
              {minutes.map((minute) => (
                <div
                  key={minute}
                  className={`h-8 flex items-center justify-center text-xs cursor-pointer select-none text-black ${
                    selectedSlots[slotKey(hour, minute)] ? 'bg-rallyYellow' : ''
                  }`}
                  data-slot={`${hour}-${minute}`}
                  onClick={() => toggleSlotSelection(hour, minute)}
                >
                  {minute === 0 ? ':00' : `:${minute}`}
                </div>
              ))}
            </div>

            <div
              className={`w-14 h-32 flex items-center justify-center border border-gray-200 font-bold text-5xl ${
                isHourSelected(hour) ? 'bg-rallyYellow' : ''
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
