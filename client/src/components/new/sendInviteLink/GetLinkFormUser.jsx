'use client';
import { useState, useEffect } from 'react';
import ShareInviteButton from './ShareInviteButton';
import Image from 'next/image';
import ThumbsUp from '@/assets/15.png';

export default function GetLinkFormUser({ user, getTogetherName }) {
  console.log(user);
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [mobileNumber, setMobileNumber] = useState(user.phone || '');
  const [countryCode, setCountryCode] = useState('+1'); // Default to US
  const [repeatInterval, setRepeatInterval] = useState('None');

  return (
    <div className="flex w-[90%] flex-col items-center mt-1">
      <h2 className="mb-2 text-2xl font-medium">{getTogetherName}</h2>
      <p className="text-xs font-medium items-center">Be the first to RALLY!</p>
      <form className="mt-4 w-full relative">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          className="w-full border-2 shadow-md px-8 text-lg tracking-wider shadow-blue-300 border-rallyBlue rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rallyBlue"
        />
      </form>

      <form className="w-full mt-4 relative">
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email*"
          className="w-full border-2 shadow-md px-8 text-lg tracking-wider shadow-blue-300 border-rallyBlue rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rallyBlue"
        />
      </form>

      <div className="mt-4 flex items-center w-full">
        {/* Country Code Dropdown */}
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="border-2 shadow-md shadow-blue-300 text-lg tracking-wider border-rallyBlue rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rallyBlue text-center h-full"
        >
          <option value="+1">+1</option>
          <option value="+44">+44</option>
          <option value="+91">+91</option>
          <option value="+61">+61</option>
          <option value="+81">+81</option>
          <option value="+49">+49</option>
        </select>

        {/* Mobile Number Input */}
        <form className="w-full mt-0 relative ml-4">
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Mobile Number*"
            className="w-full border-2 shadow-md px-8 text-lg tracking-wider shadow-blue-300 border-rallyBlue rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rallyBlue h-full"
          />
        </form>
      </div>

      <p className="items-center text-xs font-medium mt-3">
        *To recieve responses, updates, and reminders
      </p>
      <div className="relative mt-4 ml-10">
        <Image src={ThumbsUp} className="ml-2" height={200} width={200} />
        <p className="absolute bottom-3.5 left-0 w-full text-center text-xs font-medium">
          You're the FIRST and going!
        </p>
      </div>
      <p className="items-center font-medium text-lg mt-3 text-center">
        Put this on repeat mode - how often should Rallyvite plan this
        get-together?
      </p>

      <select
        value={repeatInterval}
        onChange={(e) => setRepeatInterval(e.target.value)}
        className="w-full border-2 shadow-md px-8 text-lg font-medium tracking-wider border-black rounded-xl p-3 mt-1"
      >
        <option className="text-lg font-medium" value="None">
          None
        </option>
        <option className="text-lg font-medium" value="Every Week">
          Every Week
        </option>
        <option className="text-lg font-medium" value="Every 2 Weeks">
          Every 2 Weeks
        </option>
        <option className="text-lg font-medium" value="Every 3 Weeks">
          Every 3 Weeks
        </option>
        <option className="text-lg font-medium" value="Every Month">
          Every Month
        </option>
        <option className="text-lg font-medium" value="Every 2 Months">
          Every 2 Months
        </option>
        <option className="text-lg font-medium" value="Every 3 Months">
          Every 3 Months
        </option>
        <option className="text-lg font-medium" value="Every 4 Months">
          Every 4 Months
        </option>
        <option className="text-lg font-medium" value="Every 5 Months">
          Every 5 Months
        </option>
        <option className="text-lg font-medium" value="Every 6 Months">
          Every 6 Months
        </option>
        <option className="text-lg font-medium" value="Every 9 Months">
          Every 9 Months
        </option>
        <option className="text-lg font-medium" value="Every Year">
          Every Year
        </option>
      </select>
    </div>
  );
}
