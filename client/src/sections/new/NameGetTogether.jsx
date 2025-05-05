'use client';
import { useState, useEffect } from 'react';
import ProgressTracker from '../../components/navigation/ProgressTracker';
import GetTogetherNameForm from '../../components/new/nameGetTogether/GetTogetherNameForm';
import GetTogetherDescriptionForm from '../../components/new/nameGetTogether/GetTogetherDescriptionForm';
import GetTogetherDurationForm from '../../components/new/nameGetTogether/GetTogetherDurationForm';
import CollapsedSummary from '../../components/new/nameGetTogether/CollapsedSummary';
import { useBottomActionBar } from '@/context/BottomActionBarContext';
import { useSelector, useDispatch } from 'react-redux';
import {
  setName,
  setDescription,
  setDuration,
  setNameCompleted,
  setDescriptionCompleted,
  setDurationCompleted,
  setNameSectionCompleted,
} from '../../redux/slices/getTogetherSlice';

export default function NameGetTogether({ setCurrentStep }) {
  const dispatch = useDispatch();
  const {
    name,
    description,
    duration,
    nameCompleted,
    descriptionCompleted,
    durationCompleted,
    nameSectionCompleted,
  } = useSelector((state) => state.getTogether);

  const [activeStep, setActiveStep] = useState('name');

  const { setBottomAction } = useBottomActionBar();

  useEffect(() => {
    {
      setBottomAction({
        label: 'Next',
        disabled: !nameSectionCompleted,
        onClick: () => {
          setCurrentStep(2);
        },
      });
    }
  }, []);

  return (
    <>
      {activeStep === 'name' ? (
        <GetTogetherNameForm
          name={name}
          onNameSubmit={(name) => {
            dispatch(setName(name));
            setActiveStep('description');
            dispatch(setNameCompleted(true));
          }}
        />
      ) : (
        <CollapsedSummary
          label="Get-Together Activity Name"
          value={name}
          onEdit={() => setActiveStep('name')}
          isCompleted={nameCompleted}
        />
      )}
      {activeStep === 'description' ? (
        <GetTogetherDescriptionForm
          description={description}
          onDescriptionSubmit={(description) => {
            dispatch(setDescription(description));
            setActiveStep('duration');
            dispatch(setDescriptionCompleted(true));
          }}
          onSkip={() => {
            dispatch(setDescription(''));
            setActiveStep('duration');
            dispatch(setDescriptionCompleted(true));
          }}
        />
      ) : (
        <CollapsedSummary
          label="Description (optional)"
          value={description}
          onEdit={() => setActiveStep('description')}
          isCompleted={descriptionCompleted}
        />
      )}
      {activeStep === 'duration' ? (
        <GetTogetherDurationForm
          onDurationSubmit={(duration) => {
            dispatch(setDuration(duration));
            dispatch(setDurationCompleted(true));
            dispatch(setNameSectionCompleted(true));
          }}
          setCurrentStep={setCurrentStep}
        />
      ) : (
        <CollapsedSummary
          label="Duration"
          value={duration}
          onEdit={() => setActiveStep('duration')}
          isCompleted={durationCompleted}
        />
      )}
    </>
  );
}
