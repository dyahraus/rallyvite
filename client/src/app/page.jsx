'use client';

import { useEffect, useState } from 'react';
import { useDispatch, Provider } from 'react-redux';

import { setUser } from '@/redux/slices/userSlice';
import { getCurrentUser } from '@/api/auth/getCurrentUser';
import { BottomActionBarProvider } from '@/context/BottomActionBarContext';
import { store } from '../redux/store';
import MainNavBar from '@/components/navigation/MainNavBar';
import BottomActionBar from '@/components/navigation/BottomActionBar';
import New from '@/sections/new/New';
import Upcoming from '@/sections/upcoming/Upcoming';
import Highlights from '@/sections/highlights/Highlights';
import Me from '@/sections/me/Me';
import RSVP from '@/sections/rsvp/RSVP';

function HomeContent() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('new');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getCurrentUser();
        dispatch(setUser(user));
      } catch (err) {
        console.error('Failed to load user:', err);
      }
    };

    loadUser();
  }, [dispatch]);

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'rsvp':
        return <RSVP />;
      case 'upcoming':
        return <Upcoming setActiveTab={setActiveTab} />;
      case 'new':
        return <New setActiveTab={setActiveTab} />;
      case 'highlights':
        return <Highlights />;
      case 'me':
        return <Me />;
      default:
        return <New setActiveTab={setActiveTab} />;
    }
  };

  return (
    <>
      {renderActiveSection()}
      <div className="fixed bottom-0 w-full flex flex-col items-center">
        <MainNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        <BottomActionBar />
      </div>
    </>
  );
}

export default function Home() {
  return (
    <Provider store={store}>
      <BottomActionBarProvider>
        <HomeContent />
      </BottomActionBarProvider>
    </Provider>
  );
}
