'use client';
import { useState } from 'react';
import ProgressTracker from '../../components/navigation/ProgressTracker';
import GetTogetherNameForm from '../../components/new/nameGetTogether/GetTogetherNameForm';
import GetTogetherDescriptionForm from '../../components/new/nameGetTogether/GetTogetherDescriptionForm';
import GetTogetherDurationForm from '../../components/new/nameGetTogether/GetTogetherDurationForm';
import CollapsedSummary from '../../components/new/nameGetTogether/CollapsedSummary';
import MainNavBar from '../../components/navigation/MainNavBar';
import BottomActionBar from '../../components/navigation/BottomActionBar';
import { useSelector, useDispatch } from 'react-redux';
import {
  setName,
  setDescription,
  setDuration,
} from '../../redux/slices/getTogetherSlice';

export default function NameGetTogether({ setCurrentStep }) {
  const dispatch = useDispatch();
  const name = useSelector((state) => state.getTogether.name);
  const description = useSelector((state) => state.getTogether.description);
  const duration = useSelector((state) => state.getTogether.duration);

  const [activeStep, setActiveStep] = useState('name');
  const [nameCompleted, setNameCompleted] = useState(false);
  const [descriptionCompleted, setDescriptionCompleted] = useState(false);
  const [durationCompleted, setDurationCompleted] = useState(false);

  return (
    <>
      {activeStep === 'name' ? (
        <GetTogetherNameForm
          name={name}
          onNameSubmit={(name) => {
            dispatch(setName(name));
            setActiveStep('description');
            setNameCompleted(true);
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
            setDescriptionCompleted(true);
          }}
          onSkip={() => {
            dispatch(setDescription(''));
            setActiveStep('duration');
            setDescriptionCompleted(true);
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
            setActiveStep('duration');
            setDurationCompleted(true);
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
