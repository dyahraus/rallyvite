'use client';
import TimeGrid from './TimeGrid';
import React, { useState } from 'react';
import DateCarousel from './DateCarousel';

export default function GetTogetherTimeOptions() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="flex w-[90%] flex-col items-center mt-5">
      <h2 className="mb-2">Get-Together Time Option(s)</h2>
      <DateCarousel
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
      <TimeGrid />
    </div>
  );
}
