'use-client';
import Image from 'next/image';
import HolderPFP from '@/assets/9.png';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useBottomActionBar } from '@/context/BottomActionBarContext';
import { editUser } from '@/api/auth/editUser';
import { setUser } from '@/redux/slices/userSlice';
import { createUser } from '@/api/auth/createUser';
import { findUserEvents } from '@/api/events/getUserEvents';
import EventCarousel from '@/components/me/EventCarousel';
import NotificationSettings from '@/components/me/NotficiationSettings';

export default function Me() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.data);
  const user = currentUser?.currentUser;
  console.log(user);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobileNumber, setMobileNumber] = useState(user?.phone || '');
  const [countryCode, setCountryCode] = useState('+1'); // Default to US
  const [events, setEvents] = useState(null);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  const { setBottomAction } = useBottomActionBar();

  useEffect(() => {
    if (!user) {
      setBottomAction({
        label: 'Create Account',
        disabled: false,
        onClick: handlecreate,
      });
    } else {
      setBottomAction({
        label: 'Update',
        disabled: false,
        onClick: handleSave,
      });
    }
  }, [name, email, mobileNumber, countryCode]);

  const handlecreate = async () => {
    try {
      console.log('Creating user with:', {
        name,
        email,
        phone: `${countryCode}${mobileNumber}`,
      });
      const createdUser = await createUser({
        name,
        email,
        phone: `${countryCode}${mobileNumber}`,
      });
      console.log(createdUser);
      dispatch(setUser(createdUser.user));
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleSave = async () => {
    try {
      const updatedUser = await editUser({
        uuid: user.uuid,
        name,
        email,
        mobileNumber: `${countryCode}${mobileNumber}`,
      });

      // Update Redux store with new user data
      dispatch(setUser(updatedUser.user));

      // Show success message or navigate
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert(error.error || 'Failed to update profile');
    }
  };

  const getUserEvents = async () => {
    try {
      const response = await findUserEvents();
      return response.data || [];
    } catch (error) {
      console.error('Error fetching user events:', error);
      return [];
    }
  };

  const [numGroups, setNumGroups] = useState(0);

  useEffect(() => {
    if (user) {
      getUserEvents().then((result) => {
        setEvents(result); // <- first set the full events array
        console.log('HERE ARE THE EVENTS', result);
        setNumGroups(result.length); // <- then count and set the number of groups
      });
    } else {
      setEvents(null);
      setNumGroups(0);
    }
  }, [user]);

  return (
    <div className="h-screen flex flex-col items-center px-6 pt-6">
      <h1 className="font-bold text-lg md:text-2xl">Me</h1>
      <div className="relative mt-2 w-20 h-20 md:w-28 md:h-28">
        <Image
          src={HolderPFP}
          alt="User"
          fill
          className="rounded-full object-cover"
        />
      </div>

      <form className="mt-4 w-full relative">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          className="w-full md:text-xl border-2 text-lg tracking-wider shadow-sm shadow-blue-300 border-rallyBlue rounded-xl py-2 px-6"
        />
      </form>

      <form className="w-full mt-3 relative">
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email*"
          className="w-full md:text-xl md:mt-2 border-2 shadow-sm py-2 px-6 text-lg tracking-wider shadow-blue-300 border-rallyBlue rounded-xl focus:outline-none focus:ring-2 focus:ring-rallyBlue"
        />
      </form>

      <div className="mt-3 md:mt-6 flex items-center w-full">
        {/* Country Code Dropdown */}
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="border-2 md:text-xl shadow-sm shadow-blue-300 text-lg tracking-wider border-rallyBlue rounded-xl h-10 text-center h-full"
        >
          <option value="+1">+1</option>
          <option value="+44">+44</option>
          <option value="+91">+91</option>
          <option value="+61">+61</option>
          <option value="+81">+81</option>
          <option value="+49">+49</option>
        </select>

        {/* Mobile Number Input */}
        <form className="w-full mt-0 relative ml-4">
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Mobile Number*"
            className="w-full border-2 md:text-xl shadow-sm py-2 px-6 text-lg tracking-wider shadow-blue-300 border-rallyBlue rounded-xl focus:outline-none focus:ring-2 focus:ring-rallyBlue h-full"
          />
        </form>
      </div>

      <p className="items-center text-xs font-medium mt-3 md:mt-5 md:text-lg">
        *To recieve responses, updates, and reminders
      </p>

      <NotificationSettings />

      {/* <p className="mt-4 md:text-2xl">Number of Rallyvite Groups</p>
      <div className="text-8xl md:text-9xl font-bold text-rallyBlue mt-3">
        {numGroups}
      </div>

      <p className="md:text-2xl"> Manage Get-Togethers</p>
      {events && events.length > 0 && (
        <EventCarousel
          events={events}
          currentIndex={currentEventIndex}
          setCurrentIndex={setCurrentEventIndex}
        />
      )} */}
    </div>
  );
}
