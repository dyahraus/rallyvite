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

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function PollLocationsTimes({}) {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState('location');
  const [locationCompleted, setLocationCompleted] = useState(false);
  const [timesCompleted, setTimesCompleted] = useState(false);

  return (
    <>
      <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
        <>
          {activeStep === 'location' ? (
            <GetTogetherLocationOptions
              onLocationSubmit={(locationData) => {
                dispatch(setLocation(locationData));
                dispatch(setSelectedLocation(locationData));
                setLocationCompleted(true);
                setActiveStep('times');
              }}
            />
          ) : (
            <CollapsedSummary
              label="Get-Together Location(s)"
              onEdit={() => setActiveStep('location')}
              isCompleted={true}
            />
          )}
        </>
      </LoadScript>
      {activeStep === 'times' ? (
        <GetTogetherTimeOptions />
      ) : (
        <CollapsedSummary
          label="Get-Together Time Option(s)"
          onEdit={() => setActiveStep('times')}
          isCompleted={true}
        />
      )}
    </>
  );
}
