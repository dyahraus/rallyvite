'use client';
import { useState, useEffect } from 'react';
import GetTogetherLocationOptions from '../../components/new/pollLocationTime/GetTogetherLocationOptions';
import GetTogetherTimeOptions from '../../components/new/pollLocationTime/GetTogetherTimeOptions';
import CollapsedSummary from '@/components/new/nameGetTogether/CollapsedSummary';
import { LoadScript } from '@react-google-maps/api';
import { useSelector, useDispatch } from 'react-redux';
import {
  setLocation,
  setSelectedLocation,
} from '../../redux/slices/getTogetherSlice';
import LocationCarousel from '@/components/new/sendInviteLink/LocationCarousel';
import { useBottomActionBar } from '@/context/BottomActionBarContext';

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function PollLocationsTimes({ setCurrentStep }) {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState('location');
  const { setBottomAction } = useBottomActionBar();
  const [locationCompleted, setLocationCompleted] = useState(false);
  const [timesCompleted, setTimesCompleted] = useState(false);
  const { locations } = useSelector((state) => state.getTogether);

  useEffect(() => {
    if (locationCompleted || timesCompleted) {
      setBottomAction({
        label: 'Continue',
        disabled: false,
        onClick: () => setCurrentStep(3),
      });
    } else {
      setBottomAction({
        label: 'Continue',
        disabled: true,
        onClick: () => {},
      });
    }
  }, [locationCompleted, timesCompleted]);

  const renderLocationSection = () => {
    if (activeStep === 'location') {
      return (
        <GetTogetherLocationOptions
          onLocationSubmit={(locationData) => {
            dispatch(setLocation(locationData));
            dispatch(setSelectedLocation(locationData));
            setLocationCompleted(true);
            setActiveStep('times');
          }}
        />
      );
    }

    if (locationCompleted) {
      return <LocationCarousel locations={locations} />;
    }

    return (
      <CollapsedSummary
        label="Get-Together Location(s)"
        onEdit={() => setActiveStep('location')}
        isCompleted={false}
      />
    );
  };

  return (
    <>
      <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
        {renderLocationSection()}
      </LoadScript>
      {activeStep === 'times' ? (
        <GetTogetherTimeOptions />
      ) : (
        <CollapsedSummary
          label="Get-Together Time Option(s)"
          onEdit={() => setActiveStep('times')}
          isCompleted={timesCompleted}
        />
      )}
    </>
  );
}
