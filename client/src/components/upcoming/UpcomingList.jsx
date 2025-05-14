'use client';
import Image from 'next/image';
import HolderPFP from '@/assets/9.png';
import ThumbsUp from '@/assets/24-ofcpy.PNG';
import Crying from '@/assets/23-ofcpy.PNG';
import Maybe from '@/assets/25-ofcpy.PNG';

const attendanceEmoji = {
  yes: ThumbsUp,
  maybe: Maybe,
  no: Crying,
};

export default function UpcomingList({ events, selectedEvent, onEventSelect }) {
  if (events.length === 0) {
    return <p>No upcoming events.</p>;
  }

  return (
    <>
      <h2 className="font-bold text-xl mb-6">Upcoming Get-Togethers</h2>
      <div className="space-y-6 w-full max-w-md">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => onEventSelect(event)}
            className={`rounded-xl shadow p-4 relative border cursor-pointer transition-colors ${
              selectedEvent?.id === event.id ? 'bg-rallyYellow' : 'bg-white'
            }`}
          >
            <div className="text-center">
              <div className="font-semibold">{event.date}</div>
              <div className="text-sm font-medium">{event.time}</div>
              <div className="mt-2 font-bold text-lg">{event.name}</div>
              <div className="text-sm font-medium">{event.location}</div>
            </div>

            <div className="w-full overflow-x-auto mt-4">
              <div className="flex justify-center space-x-2 w-max mx-auto px-2">
                {event.users.map((user) => (
                  <div
                    key={user.id}
                    className="relative flex-shrink-0 w-12 h-12 rounded-full border-2 border-blue-500"
                  >
                    <Image
                      src={user.profilePic}
                      alt="User"
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                    <span className="absolute -top-1 -right-1 text-lg">
                      <Image
                        src={attendanceEmoji[user.status]}
                        width={30}
                        height={30}
                        alt="status"
                      />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mx-auto bg-rallyBlue text-rallyYellow text-sm rounded-full px-3 py-1 mt-4 font-bold shadow w-fit">
              {event.messageCount}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
