'use client';
import NameGetTogether from '../sections/new/NameGetTogether';
import PollLocationsTimes from '../sections/new/PollLocationsTimes';
import MainNavBar from '@/components/navigation/MainNavBar';
import BottomActionBar from '@/components/navigation/BottomActionBar';
import New from '@/sections/new/New';
import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('new');
  const [bottomAction, setBottomAction] = useState({
    label: 'Next',
    disabled: true,
    onClick: () => {},
  });

  return (
    <>
      <New setBottomAction={setBottomAction} />
      {/* Bottom nav and action bar container */}
      <div className="fixed bottom-0 w-full flex flex-col-reverse items-center">
        <BottomActionBar
          label={bottomAction.label}
          disabled={bottomAction.disabled} // Replace with real validation
          onClick={bottomAction.onClick}
        />
        <MainNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </>
  );
}
