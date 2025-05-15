'use client';
import { useState, useEffect } from 'react';
import GetTogetherLocationOptions from '../../components/new/pollLocationTime/GetTogetherLocationOptions';
import GetTogetherTimeOptions from '../../components/new/pollLocationTime/GetTogetherTimeOptions';
import LocationCollapsedSummary from '@/components/new/pollLocationTime/LocationCollapsedSummary';
import NameCollapsedSummary from '@/components/new/nameGetTogether/NameCollapsedSummary';
import CollapsedSummary from '@/components/new/nameGetTogether/CollapsedSummary';
import { useJsApiLoader } from '@react-google-maps/api';
import { useSelector, useDispatch } from 'react-redux';
import {
  setLocation,
  setSelectedLocation,
} from '../../redux/slices/getTogetherSlice';
import LocationCarousel from '@/components/new/pollLocationTime/LocationCarousel';
import { useBottomActionBar } from '@/context/BottomActionBarContext';

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function PollLocationsTimes({ setCurrentStep }) {
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState('location');
  const { setBottomAction } = useBottomActionBar();
  const [locationCompleted, setLocationCompleted] = useState(false);
  const [timesCompleted, setTimesCompleted] = useState(true);
  const { locations } = useSelector((state) => state.getTogether);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: ['places'],
  });

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
      return (
        <LocationCarousel
          expanded={expanded}
          setExpanded={setExpanded}
          setActiveStep={setActiveStep}
          locations={locations}
          onLocationSubmit={(locationData) => {
            dispatch(setLocation(locationData));
            dispatch(setSelectedLocation(locationData));
            setLocationCompleted(true);
            setActiveStep('times');
          }}
        />
      );
    }

    return (
      <NameCollapsedSummary
        label="Get-Together Location(s)"
        onEdit={() => setActiveStep('location')}
        isCompleted={true}
      />
    );
  };

  if (loadError) return <div>Error loading Google Maps API.</div>;
  if (!isLoaded) return <div>Loading map resources...</div>; // optional spinner

  return (
    <>
      {renderLocationSection()}
      {activeStep === 'times' ? (
        <GetTogetherTimeOptions
          setCurrentStep={setCurrentStep}
          activeStep={activeStep}
        />
      ) : (
        <LocationCollapsedSummary
          label="Get-Together Time Option(s)"
          onEdit={() => {
            setActiveStep('times');
            setExpanded(false);
          }}
          isCompleted={timesCompleted}
        />
      )}
    </>
  );
}
