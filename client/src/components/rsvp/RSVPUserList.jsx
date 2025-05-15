'use client';
import QuestionIcon from '@/assets/26.png';
import ResponseIcon from '@/assets/24-ofcpy.PNG';
import Image from 'next/image';

export default function RSVPUserList({ event }) {
  const users = event.users || [];
  const youUser = {
    name: 'You',
    email: '',
    phone: '',
    profilePicture: '',
  };
  const allUsers = [youUser, ...users];
  const responsePicture = ResponseIcon;

  return (
    <div className="flex flex-col items-center py-1 w-full max-w-[160px] rounded-lg">
      <h5 className="text-sm text-center whitespace-nowrap font-semibold mb-1 leading-tight">
        Crew
      </h5>
      <div className="flex flex-col gap-1 w-full">
        {allUsers.map((user, idx) => (
          <div
            key={user.email || user.name || idx}
            className="flex flex-row items-center w-full rounded-full px-1 bg-rallyYellow"
          >
            <Image
              className="w-10 h-10 translate-y-1.5 rounded-full mb-2"
              src={user.profilePicture || QuestionIcon}
              alt={user.name}
            />
            <p className="text-sm ml-1 font-medium truncate">{user.name}</p>
            <Image
              className="w-8 h-8 translate-y-1 rounded-full mb-2 ml-auto"
              src={responsePicture}
              alt="Response"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
