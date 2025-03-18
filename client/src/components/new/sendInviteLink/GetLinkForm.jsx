'use client';
import { useState, useEffect } from 'react';
import ShareInviteButton from './ShareInviteButton';

export default function GetLinkForm({ getTogetherName }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1'); // Default to US

  return (
    <div className="flex w-[90%] flex-col items-center mt-1">
      <h2 className="mb-2 text-xl font-medium">{getTogetherName}</h2>
      <form className="w-full relative">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          className="w-full border-4 shadow-md px-8 text-lg tracking-wider shadow-blue-300 border-rallyBlue rounded-3xl p-3 focus:outline-none focus:ring-2 focus:ring-rallyBlue"
        />
      </form>

      <form className="w-full mt-4 relative">
        <input
          type="text"
          value={name}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email*"
          className="w-full text-lg tracking-wider border-4 shadow-md px-8 shadow-blue-300 border-rallyBlue rounded-3xl p-3 focus:outline-none focus:ring-2 focus:ring-rallyBlue"
        />
      </form>

      {/* Country Code Dropdown */}
      <select
        value={countryCode}
        onChange={(e) => setCountryCode(e.target.value)}
        className="border-4 shadow-md shadow-blue-300 text-lg tracking-wider border-rallyBlue rounded-3xl p-3 focus:outline-none focus:ring-2 focus:ring-rallyBlue h-15 w-25 text-center"
      >
        <option value="+1">+1</option>
        <option value="+44">+44</option>
        <option value="+91">+91</option>
        <option value="+61">+61</option>
        <option value="+81">+81</option>
        <option value="+49">+49</option>
      </select>

      <form className="w-full mt-4 relative">
        <input
          type="text"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          placeholder="Mobile Number*"
          className="w-full text-lg tracking-wider border-4 shadow-md px-8 shadow-blue-300 border-rallyBlue rounded-3xl p-3 focus:outline-none focus:ring-rallyBlue"
        />
      </form>
    </div>
  );
}
