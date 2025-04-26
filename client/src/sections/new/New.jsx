'use client';
import NameGetTogether from './NameGetTogether';
import PollLocationsTimes from './PollLocationsTimes';
import ProgressTracker from '@/components/navigation/ProgressTracker';
import SendInviteLink from '@/sections/new/SendInviteLink';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export default function New() {
  const [currentStep, setCurrentStep] = useState(1);
  const name = useSelector((state) => state.getTogether.name);

  return (
    <div className="h-screen flex flex-col items-center pt-6">
      <h1 className="font-bold text-xl">{name ? name : 'New Rallyvite'}</h1>
      <ProgressTracker
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
      {currentStep === 1 ? (
        <NameGetTogether setCurrentStep={setCurrentStep} />
      ) : currentStep === 2 ? (
        <PollLocationsTimes setCurrentStep={setCurrentStep} />
      ) : currentStep === 3 ? (
        <SendInviteLink />
      ) : null}
    </div>
  );
}
