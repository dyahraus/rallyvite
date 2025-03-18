'use client';
import { useState } from 'react';
import ProgressTracker from '@/components/navigation/ProgressTracker';
import GetTogetherLocationOptions from '../../components/new/pollLocationTime/GetTogetherLocationOptions';
import GetTogetherTimeOptions from '../../components/new/pollLocationTime/GetTogetherTimeOptions';
import MainNavBar from '@/components/navigation/MainNavBar';
import BottomActionBar from '@/components/navigation/BottomActionBar';
import { LoadScript } from '@react-google-maps/api';

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function PollLocationsTimes() {
  const [activeTab, setActiveTab] = useState('new'); // Example state for the nav bar
  return (
    <>
      <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
        <GetTogetherLocationOptions
          onLocationSubmit={() => console.log('test')}
        />
      </LoadScript>
      <GetTogetherTimeOptions />
      {/* Bottom nav and action bar container */}
      <div className="fixed bottom-0 w-full flex flex-col-reverse items-center">
        <BottomActionBar
          label={'Next'}
          disabled={false} // Replace with real validation
          onClick={() => {
            console.log('Hello');
          }}
        />
        <MainNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </>
  );
}
