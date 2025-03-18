'use client';
import { useState, useEffect } from 'react';

export default function GetTogetherDurationForm({
  onDurationSubmit,
  setBottomAction,
  setCurrentStep,
}) {
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('00');
  const [openEnded, setOpenEnded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const duration = openEnded ? 'Open Ended' : `${hours}h ${minutes}m`;
    onDurationSubmit(duration); // Pass duration back to parent
  };

  // Update BottomAction dynamically whenever duration selection changes
  useEffect(() => {
    const isValidDuration =
      openEnded || parseInt(hours) > 0 || parseInt(minutes) > 0;

    setBottomAction({
      label: 'Next',
      disabled: !isValidDuration, // Enable only if a valid duration is selected
      onClick: () => setCurrentStep(2), // Trigger form submission
    });
  }, [hours, minutes, openEnded, setBottomAction]);

  return (
    <div className="flex w-[90%] flex-col items-center mt-5">
      <h2 className="mb-2">Get-Together Duration</h2>

      {!openEnded && (
        <div className="flex space-x-4">
          <div className="flex flex-col items-center">
            <select
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="border border-gray-400 rounded-md p-2 text-center text-lg"
            >
              {[...Array(25).keys()].map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <span className="text-sm">Hours</span>
          </div>

          <div className="flex flex-col items-center">
            <select
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className="border border-gray-400 rounded-md p-2 text-center text-lg"
            >
              {['00', '15', '30', '45'].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <span className="text-sm">Minutes</span>
          </div>
        </div>
      )}

      {/* Open-ended toggle */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="openEnded"
          checked={openEnded}
          onChange={() => setOpenEnded(!openEnded)}
        />
        <label htmlFor="openEnded" className="text-gray-600 text-sm">
          Open Ended
        </label>
      </div>
    </div>
  );
}
