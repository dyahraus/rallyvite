'use client';
import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTimes } from '../../../redux/slices/getTogetherSlice';
import { useGesture } from '@use-gesture/react';
import { animated, useSpring } from '@react-spring/web';
import { useBottomActionBar } from '@/context/BottomActionBarContext';

const TimeGrid = forwardRef(function TimeGrid(
  { times, selectedDate, setCurrentStep, expanded },
  ref
) {
  console.log(
    '[DATE_DEBUG] TimeGrid render - Current date:',
    selectedDate?.toISOString()
  );

  const dispatch = useDispatch();
  const selectedLocation = useSelector(
    (state) => state.getTogether.selectedLocation
  );
  console.log('selectedLocation: ', selectedLocation);

  const [selectedSlots, setSelectedSlots] = useState(times);
  const prevDateRef = useRef(selectedDate);
  const prevLocationRef = useRef(selectedLocation);
  console.log('prevLocationRef: ', prevLocationRef);
  const selectedSlotsRef = useRef(selectedSlots);

  useEffect(() => {
    selectedSlotsRef.current = selectedSlots;
    console.log('[DATE_DEBUG] selectedSlots updated:', {
      currentDate: selectedDate?.toISOString(),
      slots: selectedSlots,
    });
  }, [selectedSlots]);

  console.log('TimeGrid received times:', times);
  console.log('TimeGrid selectedSlots state:', selectedSlots);

  const { setBottomAction } = useBottomActionBar();

  const handleTimeSubmission = (
    dateToSave,
    slotsToSave = selectedSlotsRef.current,
    locationName
  ) => {
    const normalized = new Date(dateToSave);
    normalized.setUTCHours(0, 0, 0, 0);
    console.log('[DATE_DEBUG] Submitting times:', {
      dateBeingSaved: dateToSave?.toISOString(),
      currentDate: selectedDate?.toISOString(),
      slots: slotsToSave,
      locationName,
      currentLocation: selectedLocation?.name,
    });
    dispatch(
      setTimes({
        selectedDate: normalized.toISOString(),
        selectedSlots: slotsToSave,
        locationName,
      })
    );
  };

  useImperativeHandle(
    ref,
    () => ({
      submit: () => {
        console.log('[IMPERATIVE_HANDLE] Triggered manual submission');

        if (prevDateRef.current && prevLocationRef.current) {
          handleTimeSubmission(
            prevDateRef.current,
            selectedSlotsRef.current,
            prevLocationRef.current.name
          );
        } else {
          console.warn('[IMPERATIVE_HANDLE] Missing prevDate or prevLocation', {
            prevDate: prevDateRef.current,
            prevLocation: prevLocationRef.current,
          });
        }
      },
    }),
    []
  );

  // Save previous date's slots when date or location changes
  useEffect(() => {
    console.log('[DATE_DEBUG] Date/Location change detected:', {
      prevDate: prevDateRef.current?.toISOString(),
      newDate: selectedDate?.toISOString(),
      hasDateChanged: prevDateRef.current !== selectedDate,
      hasLocationChanged:
        prevLocationRef.current?.name !== selectedLocation?.name,
      currentSlots: selectedSlots,
      prevLocation: prevLocationRef.current?.name,
      newLocation: selectedLocation?.name,
    });

    // Save slots for previous date/location combination
    if (prevDateRef.current && prevLocationRef.current) {
      console.log('[DATE_DEBUG] Saving previous state:', {
        prevDate: prevDateRef.current.toISOString(),
        prevLocation: prevLocationRef.current.name,
        slotsBeingSaved: selectedSlotsRef.current,
      });
      handleTimeSubmission(
        prevDateRef.current,
        selectedSlotsRef.current,
        prevLocationRef.current.name
      );
    }

    // Load slots for new date/location combination
    setSelectedSlots(times);
    selectedSlotsRef.current = times;

    // Update refs
    prevDateRef.current = selectedDate;
    prevLocationRef.current = selectedLocation;
  }, [selectedDate, selectedLocation]);

  // Save previous date's slots when date or location changes
  useEffect(() => {
    console.log('SUBMISSION FOR EXPANDED CHANGE', {
      prevDate: prevDateRef.current?.toISOString(),
      newDate: selectedDate?.toISOString(),
      hasDateChanged: prevDateRef.current !== selectedDate,
      hasLocationChanged:
        prevLocationRef.current?.name !== selectedLocation?.name,
      currentSlots: selectedSlots,
      prevLocation: prevLocationRef.current?.name,
      newLocation: selectedLocation?.name,
    });

    // Save slots for previous date/location combination
    if (prevDateRef.current && prevLocationRef.current) {
      console.log('SUBMISSION FOR EXPANDED CHANGE', {
        prevDate: prevDateRef.current.toISOString(),
        prevLocation: prevLocationRef.current.name,
        slotsBeingSaved: selectedSlotsRef.current,
      });
      handleTimeSubmission(
        prevDateRef.current,
        selectedSlotsRef.current,
        prevLocationRef.current.name
      );
    }

    // Load slots for new date/location combination
    setSelectedSlots(times);
    selectedSlotsRef.current = times;

    // Update refs
    prevDateRef.current = selectedDate;
    prevLocationRef.current = selectedLocation;
  }, [expanded]);

  // Separate effect to handle times updates
  useEffect(() => {
    if (selectedDate && selectedLocation) {
      console.log('[DATE_DEBUG] Times prop changed:', {
        newTimes: times,
        currentDate: selectedDate?.toISOString(),
        currentLocation: selectedLocation?.name,
      });
      setSelectedSlots(times);
      selectedSlotsRef.current = times;
    }
  }, [times, selectedDate, selectedLocation]);

  // Only update local state when user makes changes
  const toggleSlotSelection = (hour, minute) => {
    const key = slotKey(hour, minute);
    console.log('[SLOT_DEBUG] Toggling slot:', {
      hour,
      minute,
      key,
      currentValue: selectedSlots[key],
      newValue: !selectedSlots[key],
      allSelectedSlots: selectedSlots,
    });
    setSelectedSlots((prev) => {
      const newSlots = {
        ...prev,
        [key]: !prev[key],
      };
      console.log('[SLOT_DEBUG] New slots state:', newSlots);
      return newSlots;
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

  const formattedHour = (hour) => {
    if (hour === 0) return 12;
    if (hour === 12) return 12;
    return hour > 12 ? hour - 12 : hour;
  };

  const period = (hour) => (hour < 12 ? 'A' : 'P');

  //DRAG SELECT IMPLEMENTATION
  const autoScrollRef = useRef(null); // to track the rAF loop
  const pointerYRef = useRef(null); // latest pointer Y position

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
        e.preventDefault(); // ✋ block scroll only while dragging
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

    dragTimeout.current = setTimeout(() => {
      setIsDraggingSlots(true);
      draggedSlots.current = new Set();
      const key = slotKey(h, m);
      draggedSlots.current.add(key);
      toggleSlotSelection(h, m);

      // Simulate initial drag move after long press triggers drag mode
      const touch = e.touches?.[0] || e;
      handlePointerMove({
        touches: e.touches,
        clientX: touch?.clientX ?? e.clientX,
        clientY: touch?.clientY ?? e.clientY,
      });
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
      draggedSlots.current.add(dataSlot);
      toggleSlotSelection(h, m);
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
    console.log('[BOTTOM_ACTION_DEBUG] Setting up bottom action:', {
      selectedDate: selectedDate?.toISOString(),
      selectedLocation: selectedLocation?.name,
      currentSlots: selectedSlots,
      selectedSlotsRef: selectedSlotsRef.current,
    });

    setBottomAction({
      label: 'Continue',
      disabled: false,
      onClick: () => {
        console.log('[BOTTOM_ACTION_DEBUG] Bottom action clicked:', {
          selectedDate: selectedDate?.toISOString(),
          selectedSlots: selectedSlotsRef.current,
          locationName: selectedLocation.name,
        });

        dispatch(
          setTimes({
            selectedDate: selectedDate.toISOString(),
            selectedSlots: selectedSlotsRef.current,
            locationName: selectedLocation.name,
          })
        );

        setCurrentStep(3);
      },
    });
  }, [selectedDate, selectedLocation]);

  // Update the ref whenever selectedSlots changes
  useEffect(() => {
    console.log('[SLOT_DEBUG] Updating selectedSlotsRef:', selectedSlots);
    selectedSlotsRef.current = selectedSlots;
  }, [selectedSlots]);

  return (
    <div className="relative flex w-[95%] max-w-md h-56 mt-1 shadow-sm">
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
                isHourSelected(hour) ? 'bg-rallyYellow' : ''
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
              {minutes.map((minute) => (
                <div
                  key={minute}
                  className={`h-7 flex items-center justify-center text-xs font-semibold cursor-pointer select-none text-black ${
                    selectedSlots[slotKey(hour, minute)] ? 'bg-rallyYellow' : ''
                  }`}
                  data-slot={`${hour}-${minute}`}
                  onClick={() => toggleSlotSelection(hour, minute)}
                >
                  {minute === 0 ? ':00' : `:${minute}`}
                </div>
              ))}
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
});

export default TimeGrid;
