import QuestionIcon from '@/assets/26.png';
import ResponseIcon from '@/assets/24-ofcpy.PNG';
import Image from 'next/image';

export default function RSVPUserList({ event }) {
  console.log(event);
  const users = event.users || [];
  // Placeholder for the current user
  const youUser = {
    name: 'You',
    email: '',
    phone: '',
    profilePicture: '',
  };
  // Prepend 'You' to the users list
  const allUsers = [youUser, ...users];
  const responsePicture = ResponseIcon;

  return (
    <div className="flex flex-col items-center p-5">
      <h5 className="text-lg text-center whitespace-nowrap font-bold mb-2">
        Get-Together Crew
      </h5>
      <div className="w-full flex flex-col gap-2">
        {allUsers.map((user, idx) => (
          <div
            key={user.email || user.name || idx}
            className="flex flex-row rounded-full px-2 w-full bg-rallyYellow items-center"
          >
            <Image
              className="w-12 h-12 translate-y-1.5 rounded-full mb-2"
              src={user.profilePicture || QuestionIcon}
              alt={user.name}
            />
            <p className="text-lg ml-1 font-medium">{user.name}</p>
            <Image
              className="w-10 h-10 translate-y-1 mr-1 rounded-full mb-2 ml-auto"
              src={responsePicture}
              alt="response icon"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
