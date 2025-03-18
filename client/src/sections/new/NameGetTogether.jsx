'use client';
import { useState } from 'react';
import ProgressTracker from '../../components/navigation/ProgressTracker';
import GetTogetherNameForm from '../../components/new/nameGetTogether/GetTogetherNameForm';
import GetTogetherDescriptionForm from '../../components/new/nameGetTogether/GetTogetherDescriptionForm';
import GetTogetherDurationForm from '../../components/new/nameGetTogether/GetTogetherDurationForm';
import CollapsedSummary from '../../components/CollapsedSummary';
import MainNavBar from '../../components/navigation/MainNavBar';
import BottomActionBar from '../../components/navigation/BottomActionBar';

export default function NameGetTogether({
  getTogether,
  setGetTogether,
  setBottomAction,
  setCurrentStep,
}) {
  const [nameCompleted, setNameCompleted] = useState(false);
  const [descriptionCompleted, setDescriptionCompleted] = useState(false);
  const [durationCompleted, setDurationCompleted] = useState(false);

  return (
    <>
      {getTogether.activeStep === 'name' ? (
        <GetTogetherNameForm
          name={getTogether.name}
          onNameSubmit={(name) => {
            setGetTogether((prev) => ({
              ...prev,
              name: name,
              activeStep: 'description', // Automatically move to description after submitting name
            }));
            setNameCompleted(true);
          }}
        />
      ) : (
        <CollapsedSummary
          label="Get-Together Activity Name"
          value={getTogether.name}
          onEdit={() =>
            setGetTogether((prev) => ({
              ...prev,
              activeStep: 'name',
            }))
          }
          isCompleted={nameCompleted}
        />
      )}
      {getTogether.activeStep === 'description' ? (
        <GetTogetherDescriptionForm
          description={getTogether.description}
          onDescriptionSubmit={(description) => {
            setGetTogether((prev) => ({
              ...prev,
              description: description,
              activeStep: 'duration',
            }));
            setDescriptionCompleted(true);
          }}
          onSkip={() => {
            setGetTogether((prev) => ({
              ...prev,
              description: '',
              activeStep: 'duration',
            }));
            setDescriptionCompleted(true);
          }}
        />
      ) : (
        <CollapsedSummary
          label="Description (optional)"
          value={getTogether.description}
          onEdit={() =>
            setGetTogether((prev) => ({
              ...prev,
              activeStep: 'description',
            }))
          }
          isCompleted={descriptionCompleted}
        />
      )}
      {getTogether.activeStep === 'duration' ? (
        <GetTogetherDurationForm
          onDurationSubmit={(duration) => {
            setGetTogether((prev) => ({
              ...prev,
              duration: description,
              activeStep: 'duration',
            }));
            setDurationCompleted(true);
          }}
          setBottomAction={setBottomAction}
          setCurrentStep={setCurrentStep}
        />
      ) : (
        <CollapsedSummary
          label="Duration"
          value={getTogether.duration}
          onEdit={() =>
            setGetTogether((prev) => ({
              ...prev,
              activeStep: 'duration',
            }))
          }
          isCompleted={durationCompleted}
        />
      )}
    </>
  );
}
