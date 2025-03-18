'use client';
import React, { useRef, useState, useEffect } from 'react';

export default function TimeGrid() {
  const gridRef = useRef(null);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const dragStartScroll = useRef(0);

  const [selectedSlots, setSelectedSlots] = useState({});

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  const slotKey = (hour, minute) => `${hour}-${minute}`;

  const isHourSelected = (hour) =>
    minutes.some((minute) => selectedSlots[slotKey(hour, minute)]);

  const toggleSlotSelection = (hour, minute) => {
    const key = slotKey(hour, minute);
    setSelectedSlots((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSlotMouseDown = (hour, minute) => {
    setIsDragging(true);
    toggleSlotSelection(hour, minute);
  };

  const handleSlotMouseEnter = (hour, minute) => {
    if (isDragging) {
      toggleSlotSelection(hour, minute);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const formattedHour = (hour) => {
    if (hour === 0) return 12;
    if (hour === 12) return 12;
    return hour > 12 ? hour - 12 : hour;
  };

  const period = (hour) => (hour < 12 ? 'A' : 'P');

  const handleScroll = () => {
    const scrollTop = gridRef.current.scrollTop;
    const maxScroll =
      gridRef.current.scrollHeight - gridRef.current.clientHeight;
    setScrollRatio(scrollTop / maxScroll);
  };

  const handleScrollbarStart = (clientY) => {
    setIsDragging(true);
    dragStartY.current = clientY;
    dragStartScroll.current = gridRef.current.scrollTop;
  };

  const handleScrollbarMouseDown = (e) => handleScrollbarStart(e.clientY);
  const handleScrollbarTouchStart = (e) =>
    handleScrollbarStart(e.touches[0].clientY);

  const handleScrollbarMove = (clientY) => {
    if (!isDragging) return;
    const deltaY = clientY - dragStartY.current;
    const scrollHeight =
      gridRef.current.scrollHeight - gridRef.current.clientHeight;
    const newScrollTop =
      dragStartScroll.current + (deltaY / 600) * scrollHeight;
    gridRef.current.scrollTop = Math.max(
      0,
      Math.min(newScrollTop, scrollHeight)
    );
  };

  const formattedHourForThumb = () => {
    const totalSlots = hours.length * 4;
    const currentSlotIndex = Math.round(scrollRatio * (totalSlots - 1));
    const hour = Math.floor(currentSlotIndex / 4);
    return formattedHour(hour);
  };

  const handleMouseMove = (e) => handleScrollbarMove(e.clientY);
  const handleTouchMove = (e) => handleScrollbarMove(e.touches[0].clientY);

  const handleEnd = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleEnd);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  return (
    <div className="relative flex w-[60%] max-w-md h-96 mt-4 shadow-sm">
      <div
        ref={gridRef}
        onScroll={handleScroll}
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
                  onMouseDown={() => handleSlotMouseDown(hour, minute)}
                  onMouseEnter={() => handleSlotMouseEnter(hour, minute)}
                  onTouchStart={() => {
                    setIsDragging(true);
                    toggleSlotSelection(hour, minute);
                  }}
                  onTouchMove={(e) => {
                    const touchedElement = document.elementFromPoint(
                      e.touches[0].clientX,
                      e.touches[0].clientY
                    );
                    if (touchedElement?.dataset?.slot) {
                      const [touchedHour, touchedMinute] =
                        touchedElement.dataset.slot.split('-').map(Number);
                      toggleSlotSelection(touchedHour, touchedMinute);
                    }
                  }}
                  data-slot={`${hour}-${minute}`}
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

        <div
          className="absolute left-1.5 w-4 h-10 bg-rallyBlue rounded-full cursor-pointer flex items-center justify-center text-rallyYellow font-bold text-sm"
          style={{ top: `calc(${scrollRatio * 100}% - 10px)` }}
          onMouseDown={handleScrollbarMouseDown}
          onTouchStart={handleScrollbarTouchStart}
        >
          {formattedHourForThumb()}
        </div>
      </div>
    </div>
  );
}
