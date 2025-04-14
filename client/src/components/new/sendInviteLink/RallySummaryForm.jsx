import Image from 'next/image';
import TextBubble from '@/assets/22-ofcpy.PNG';
import LocationCarousel from './LocationCarousel';
import { useEffect } from 'react';

export default function RallySummaryForm({ getTogether, setBottomAction }) {
  // useEffect(() => {
  //   // Call setBottomAction only once after the component renders
  //   setBottomAction({
  //     label: 'Get Rallyvite Link',
  //     disabled: false, // Enable only if a valid duration is selected
  //   });
  // }, [setBottomAction]); // Empty dependency array means this will run once when the component mounts
  return (
    <div>
      <p className="text-center mb-3">Your Get-Together Details</p>
      <h2 className="text-2xl text-center mb-2">{getTogether.name}</h2>
      <div className="mb-3 relative inline-block">
        <Image src={TextBubble} width={300} />
        <h2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg px-6 py-4 w-[300px] text-white">
          {getTogether.description}
        </h2>
      </div>
      {getTogether.duration.trim() ? (
        <p className="text-lg mb-5">
          Let's get together for ~{getTogether.duration} @
        </p>
      ) : null}

      <div className="mt-4">
        {/* Added margin-top to separate carousel from other content */}
        <LocationCarousel locations={getTogether.locations} />
      </div>
    </div>
  );
}
