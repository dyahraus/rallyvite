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

export default function Me() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);
  console.log(user);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobileNumber, setMobileNumber] = useState(user?.phone || '');
  const [countryCode, setCountryCode] = useState('+1'); // Default to US

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
      getUserEvents().then((events) => {
        setNumGroups(events.length);
      });
    } else {
      setNumGroups(0);
    }
  }, [user]);

  return (
    <div className="h-screen flex flex-col items-center pt-6">
      <h1 className="font-bold text-lg">Me</h1>
      <Image
        src={HolderPFP}
        alt="User"
        width={48}
        height={48}
        className="rounded-full object-cover"
      />

      <form className="mt-4 w-full relative">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          className="w-full border-2 shadow-md px-8 text-lg tracking-wider shadow-blue-300 border-rallyBlue rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rallyBlue"
        />
      </form>

      <form className="w-full mt-4 relative">
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email*"
          className="w-full border-2 shadow-md px-8 text-lg tracking-wider shadow-blue-300 border-rallyBlue rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rallyBlue"
        />
      </form>

      <div className="mt-4 flex items-center w-full">
        {/* Country Code Dropdown */}
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="border-2 shadow-md shadow-blue-300 text-lg tracking-wider border-rallyBlue rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rallyBlue text-center h-full"
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
            className="w-full border-2 shadow-md px-8 text-lg tracking-wider shadow-blue-300 border-rallyBlue rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rallyBlue h-full"
          />
        </form>
      </div>

      <p className="items-center text-xs font-medium mt-3">
        *To recieve responses, updates, and reminders
      </p>

      <p>Number of Rallyvite Groups</p>
      <div>{numGroups}</div>
    </div>
  );
}
