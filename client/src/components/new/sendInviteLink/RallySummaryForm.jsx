import Image from 'next/image';
import TextBubble from '@/assets/22-ofcpy.PNG';
import LocationCarousel from './LocationCarousel';
import { useEffect } from 'react';
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
  const dispatch = useDispatch();

  const { setBottomAction } = useBottomActionBar();

  const blocks = getFormattedDateTimeBlocks(getTogether);
  console.log(blocks);

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
              console.log('You are an idiot', result);
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
        <div>ALKDF</div>
        {blocks.map(({ location, date, time }, i) => (
          <div key={i} className="mb-4 text-center">
            <p className="font-semibold">{location}</p>
            <p>{date}</p>
            <p className="text-lg font-medium">{time}</p>
          </div>
        ))}
        <div>ALKJFDL</div>
      </div>
    </div>
  );
}
