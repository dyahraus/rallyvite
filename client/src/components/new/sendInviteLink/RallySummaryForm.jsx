import Image from 'next/image';
import TextBubble from '@/assets/22-ofcpy.PNG';
import LocationCarousel from './LocationCarousel';
import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useBottomActionBar } from '@/context/BottomActionBarContext';
import { createEvent } from '@/api/events/createEvent';
import { setGetTogether } from '@/redux/slices/getTogetherSlice';
import { getFormattedDateTimeBlocks } from '@/utils/getFormattedDateTimeBlocks';

export default function RallySummaryForm({ setCurrContent }) {
  const getTogether = useSelector((state) => state.getTogether);
  const name = getTogether.name;
  const description = getTogether.description;
  const duration = getTogether.duration;
  const locations = getTogether.locations;
  const selectedLocation = useSelector(
    (state) => state.getTogether.selectedLocation
  );
  const dispatch = useDispatch();

  const { setBottomAction } = useBottomActionBar();

  const blocks = useMemo(() => {
    const allBlocks = getFormattedDateTimeBlocks(getTogether);
    return allBlocks.filter(
      (block) => block.location === selectedLocation?.name
    );
  }, [getTogether, selectedLocation]);

  useEffect(() => {
    {
      setBottomAction({
        label: 'Get Rallyvite Link',
        disabled: false,
        textColor: 'text-rallyYellow',
        onClick: () => {
          (async () => {
            try {
              const result = await createEvent(getTogether);
              dispatch(
                setGetTogether({ ...getTogether, eventUuid: result.uuid })
              );
              console.log('Event created:', result); // delete
              setCurrContent('Link');
            } catch (err) {
              console.error('Event creation failed:', err);
            }
          })();
        },
      });
    }
  }, []);

  return (
    <div>
      <p className="text-center mb-3 text-base md:text-xl">
        Your Get-Together Details
      </p>

      <h2 className="text-2xl md:text-4xl text-center mb-2">{name}</h2>

      <div className="mb-3 relative w-full flex justify-center items-center">
        <div className="relative">
          <Image src={TextBubble} width={300} height={200} />
          <h2
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                 text-lg md:text-2xl px-6 py-4 w-[300px] text-white text-center"
          >
            {description}
          </h2>
        </div>
      </div>

      {duration.trim() ? (
        <p className="text-lg md:text-2xl mb-5 flex items-center justify-center px-4 py-2">
          Let's get together for ~{duration} @
        </p>
      ) : null}

      <div className="mt-4">
        <LocationCarousel locations={locations} />
        {blocks.map(({ location, date, time }, i) => (
          <div key={i} className="mb-4 mt-4 text-center">
            <p className="font-bold text-lg md:text-2xl">{date}</p>
            <p className="text-lg md:text-xl font-medium">{time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
