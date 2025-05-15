'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import HolderPFP from '@/assets/9.png';
import ThumbsUp from '@/assets/24-ofcpy.PNG';
import Crying from '@/assets/23-ofcpy.PNG';
import Maybe from '@/assets/25-ofcpy.PNG';
import { getEventFinalize } from '@/api/events/getEventFinalize';
import { useBottomActionBar } from '@/context/BottomActionBarContext';
import { finalizeEvent } from '@/api/events/finalizeEvent';

const attendanceEmoji = {
  yes: ThumbsUp,
  maybe: Maybe,
  no: Crying,
};

const mockParticipants = [
  { emoji: '👍', name: 'Alice', avatarUrl: HolderPFP.src },
  { emoji: '👍', name: 'Bob', avatarUrl: HolderPFP.src },
  { emoji: '👍', name: 'Cathy', avatarUrl: HolderPFP.src },
  { emoji: '😢', name: 'Dan', avatarUrl: HolderPFP.src },
  { emoji: '🤔', name: 'Eve', avatarUrl: HolderPFP.src },
];

export default function OrganizerFinalize({ event, onClose }) {
  const [groupedBlocks, setGroupedBlocks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selection, setSelection] = useState(null);
  console.log(selection);

  const { setBottomAction } = useBottomActionBar();

  useEffect(() => {
    setBottomAction({
      label: 'Finalize Get Together',
      disabled: true,
      onClick: () => {},
    });
  }, []);

  const handleEventFinalize = async () => {
    if (!selection) return;

    const payload = {
      eventUuid: event.uuid,
      eventDateId: selection.eventDateId,
      locationId: selection.locationId,
      startTime: selection.startTime,
      endTime: selection.endTime,
      timeIds: selection.timeIds,
    };

    try {
      await finalizeEvent(payload);
      alert('Event finalized successfully!');
      onClose?.(); // optional: close the modal or navigate
    } catch (err) {
      console.error('Finalization failed:', err);
      alert('Failed to finalize event. Please try again.');
    }
  };

  useEffect(() => {
    setBottomAction({
      label: 'Finalize Get Together',
      disabled: !selection,
      onClick: handleEventFinalize,
    });
  }, [selection]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const result = await getEventFinalize(event.uuid);
        setGroupedBlocks(result?.event ?? []);
      } catch (err) {
        console.error('Failed to fetch event finalize options:', err);
      }
    };

    fetchOptions();
  }, [event.uuid]);

  const handleNext = () => {
    if (currentPage < groupedBlocks.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const currentBlocks = groupedBlocks[currentPage] || [];

  console.log('Grouped Blocks:', groupedBlocks);
  console.log('Current Page:', currentPage);
  console.log('Current Blocks:', currentBlocks);

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="font-bold text-xl mb-2">{event.name}</h2>

      {/* ✅ Scrollable list container */}
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[325px] px-2 w-full items-center">
        {currentBlocks.map((block, index) => {
          const formattedDate = format(new Date(block.date), 'EEEE, MMMM d');
          const formattedStart = format(
            new Date(`1970-01-01T${block.startTime}Z`),
            'h:mm a'
          );
          const formattedEnd = format(
            new Date(`1970-01-01T${block.endTime}Z`),
            'h:mm a'
          );

          const isSelected =
            selection &&
            selection.eventDateId === block.eventDateId &&
            selection.locationId === block.locationId &&
            selection.startTime === block.startTime;

          return (
            <div
              key={`${block.eventDateId}-${block.startTime}-${index}`}
              className={`border rounded-xl shadow p-4 w-[360px] text-center cursor-pointer ${
                isSelected ? 'bg-rallyYellow' : 'bg-white'
              }`}
              onClick={() => setSelection(block)}
            >
              <div className="font-bold text-sm text-gray-800">
                {formattedDate}
              </div>
              <div className="text-sm text-gray-600">
                {formattedStart} — {formattedEnd}
              </div>
              <div className="mt-1 text-sm font-medium text-gray-700">
                {block.locationName}
              </div>

              <div className="flex justify-center gap-2 mt-3">
                {mockParticipants.map((p, i) => (
                  <div key={i} className="relative w-10 h-10">
                    <Image
                      src={p.avatarUrl}
                      alt={p.name}
                      className="rounded-full border-2 border-blue-500"
                      width={40}
                      height={40}
                    />
                    <span className="absolute -top-1 -right-1 text-sm">
                      {p.emoji}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation button */}
      <button
        onClick={handleNext}
        disabled={currentPage >= groupedBlocks.length - 1}
        className="mt-2 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Show Next 5
      </button>
    </div>
  );
}
