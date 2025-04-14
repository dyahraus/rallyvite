'use client';
import Image from 'next/image';
import HolderPFP from '@/assets/9.png';
import ThumbsUp from '@/assets/24-ofcpy.PNG';
import Crying from '@/assets/23-ofcpy.PNG';
import Maybe from '@/assets/25-ofcpy.PNG';
import { useSelector } from 'react-redux';

const attendanceEmoji = {
  yes: ThumbsUp,
  maybe: Maybe,
  no: Crying,
};

const mockChatLog = [
  {
    id: 1,
    sender: { id: 'user1', name: 'Sarah', profilePic: HolderPFP },
    message: 'Ha ha, that was so funny Sarah.',
    type: 'text',
  },
  // {
  //   id: 2,
  //   sender: { id: 'user2', name: 'User2', profilePic: HolderPFP },
  //   message: '/path/to/mahjong-image.jpg',
  //   type: 'image',
  // },
  {
    id: 3,
    sender: { id: 'user3', name: 'User3', profilePic: HolderPFP },
    message: 'Lets do Chinese takeout.',
    type: 'text',
  },
  {
    id: 4,
    sender: { id: 'user4', name: 'User4', profilePic: HolderPFP },
    message: 'Hell ya, thanks for organizing this!',
    type: 'text',
  },
];

export default function EditingEvent({ event, onClose }) {
  const { data: currentUser, loading } = useSelector((state) => state.user);

  if (!event) return null;

  return (
    <div className="flex flex-col w-full max-w-2xl">
      {/* Event Header */}
      <div className="text-center">
        <div className="font-semibold">{event.date}</div>
        <div className="text-sm font-medium">{event.time}</div>
        <div className="mt-2 font-bold text-lg">{event.name}</div>
        <div className="text-sm font-medium">{event.location}</div>
      </div>

      {/* Attendees Row */}
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

      {/* Chat Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 mt-20">
        {!loading &&
          mockChatLog.map((message) => {
            const isCurrentUser = currentUser?.id === message.sender.id;

            return (
              <div
                key={message.id}
                className={`flex items-start space-x-2 ${
                  isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <Image
                  src={message.sender.profilePic}
                  alt={message.sender.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div
                  className={`max-w-[70%] rounded-2xl p-3 ${
                    isCurrentUser ? 'bg-rallyYellow' : 'bg-rallyBlue text-white'
                  }`}
                >
                  <p>{message.message}</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
