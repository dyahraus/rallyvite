import { useSelector } from 'react-redux';
import QuestionIcon from '@/assets/26.png';
import ResponseIcon from '@/assets/24-ofcpy.PNG';
import Image from 'next/image';

export default function UserList() {
  const users = useSelector((state) => state.getTogether.users);
  const profilePicture = users[0].profilePicture || QuestionIcon;
  const responsePicture = ResponseIcon;

  return (
    <div className="flex flex-col items-center py-1 w-full max-w-[160px] rounded-lg">
      <h5 className="text-sm text-center whitespace-nowrap font-semibold mb-1 leading-tight">
        Crew
      </h5>
      <div className="flex flex-row items-center w-full rounded-full px-1 bg-rallyYellow">
        <Image
          className="w-10 h-10 translate-y-1.5 text-xs rounded-full mb-2"
          src={profilePicture}
          alt={users[0].name}
        />
        <p className="text-sm ml-1 font-medium truncate">{users[0].name}</p>
        <Image
          className="w-8 h-8 translate-y-1 rounded-full mb-2 ml-auto"
          src={responsePicture}
          alt="Response"
        />
      </div>
    </div>
  );
}

// return (
//   <div className="flex flex-col items-center p-5">
//     <h5 className="text-lg text-center whitespace-nowrap font-bold mb-2">
//       Get-Together Crew
//     </h5>
//     <div className="flex flex-row rounded-full px-2 w-full bg-rallyYellow items-center">
//       <Image
//         className="w-12 h-12 translate-y-1.5 rounded-full mb-2"
//         src={profilePicture}
//         alt={users[0].name}
//       />
//       <p className="text-lg ml-1 font-medium">{users[0].name}</p>
//       <Image
//         className="w-10 h-10 translate-y-1 mr-1 rounded-full mb-2 ml-auto"
//         src={responsePicture}
//         alt={responsePicture}
//       />
//     </div>
//   </div>
// );
