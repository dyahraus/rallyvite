'use client';
import NameGetTogether from './NameGetTogether';
import PollLocationsTimes from './PollLocationsTimes';
import ProgressTracker from '@/components/navigation/ProgressTracker';
import SendInviteLink from '@/sections/new/SendInviteLink';
import { useState } from 'react';

export default function New({ setBottomAction }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [getTogether, setGetTogether] = useState({
    name: '',
    description: '',
    location: '',
    duration: '',
    activeStep: 'name', // 'name', 'description', 'duration'
  });
  return (
    <div className="h-screen flex flex-col items-center pt-6">
      <h1 className="font-bold text-xl">
        {getTogether.name ? getTogether.name : 'New Rallyvite'}
      </h1>
      <ProgressTracker currentStep={currentStep} />
      {currentStep === 1 ? (
        <NameGetTogether
          getTogether={getTogether}
          setGetTogether={setGetTogether}
          setCurrentStep={setCurrentStep}
          setBottomAction={setBottomAction}
        />
      ) : currentStep === 2 ? (
        <PollLocationsTimes
          getTogether={getTogether}
          setGetTogether={setGetTogether}
          setCurrentStep={setCurrentStep}
        />
      ) : currentStep === 3 ? (
        <SendInviteLink getTogether={getTogether} />
      ) : null}
    </div>
  );
}
