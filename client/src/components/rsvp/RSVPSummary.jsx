'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Maybe from '@/assets/16.png';
import Cry from '@/assets/17.png';
import ThumbsUp from '@/assets/15.png';
import { useBottomActionBar } from '@/context/BottomActionBarContext';

export default function RSVPSummary({ response, event }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1'); // Default to US

  const { setBottomAction } = useBottomActionBar();

  useEffect(() => {
    setBottomAction({
      label: 'Complete',
      disabled: !name,
      onClick: handleShare,
      textColor: name ? 'text-rallyYellow' : undefined,
    });
  }, [name, email, mobileNumber, countryCode]);

  const handleShare = async () => {
    // try {
    //   const phone = countryCode + mobileNumber;
    //   // First create and append the organizer
    //   const organizerResult = await createAndAppendOrganizer({
    //     name,
    //     email,
    //     phone,
    //     eventUuid,
    //   });
    //   if (!organizerResult || organizerResult.status !== 'SUCCESS') {
    //     throw new Error('Failed to create organizer');
    //   }
    //   // Then create the invite
    //   const urlToShare = `event/${eventUuid}`;
    //   // Try to use the native share API
    //   if (navigator.share) {
    //     try {
    //       await navigator.share({
    //         title: `Join ${getTogetherName}!`,
    //         text: 'Join my Rallyvite event 🎉',
    //         url: urlToShare,
    //       });
    //     } catch (err) {
    //       // If share fails, fallback to clipboard
    //       await navigator.clipboard.writeText(urlToShare);
    //       alert('Link copied to clipboard!');
    //     }
    //   } else {
    //     // If share API not available, use clipboard
    //     await navigator.clipboard.writeText(urlToShare);
    //     alert('Link copied to clipboard!');
    //   }
    // } catch (error) {
    //   console.error('Error:', error);
    //   alert('Failed to create invite. Please try again.');
    // }
  };

  return (
    <div className="flex w-[90%] flex-col items-center mt-1">
      <h2 className="mb-2 text-2xl font-medium">{event.name}</h2>
      <p className="text-xs font-medium items-center">Response to RALLY!</p>
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
        {response === 'yes' ? (
          <>
            <Image
              src={ThumbsUp}
              className="ml-2"
              height={200}
              width={200}
              alt={'Yes'}
            />
            <p className="absolute bottom-3.5 left-0 w-full text-center text-xs font-medium">
              See you there!
            </p>
          </>
        ) : response === 'maybe' ? (
          <>
            <Image
              src={No}
              className="ml-2"
              height={200}
              width={200}
              alt={'Maybe'}
            />
            <p className="absolute bottom-3.5 left-0 w-full text-center text-xs font-medium">
              Putting you down as a maybe!
            </p>
          </>
        ) : (
          <>
            <Image
              src={Cry}
              className="ml-2"
              height={200}
              width={200}
              alt={'No'}
            />
            <p className="absolute bottom-3.5 left-0 w-full text-center text-xs font-medium">
              We'll see you next time!
            </p>
          </>
        )}
      </div>
    </div>
  );
}
