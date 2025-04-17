import Image from 'next/image';
import TextBubble from '@/assets/22-ofcpy.PNG';
import LocationCarousel from './LocationCarousel';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function RallySummaryForm({ setBottomAction }) {
  const name = useSelector((state) => state.getTogether.name);
  const description = useSelector((state) => state.getTogether.description);
  const duration = useSelector((state) => state.getTogether.duration);
  const locations = useSelector((state) => state.getTogether.locations);

  return (
    <div>
      <p className="text-center mb-3">Your Get-Together Details</p>
      <h2 className="text-2xl text-center mb-2">{name}</h2>
      <div className="mb-3 relative inline-block">
        <Image src={TextBubble} width={300} />
        <h2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg px-6 py-4 w-[300px] text-white">
          {description}
        </h2>
      </div>
      {duration.trim() ? (
        <p className="text-lg mb-5">Let's get together for ~{duration} @</p>
      ) : null}

      <div className="mt-4">
        {/* Added margin-top to separate carousel from other content */}
        <LocationCarousel locations={locations} />
      </div>
    </div>
  );
}
