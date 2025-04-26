import GetLinkFormUser from '@/components/new/sendInviteLink/GetLinkFormUser';
import GetLinkFormGuest from '@/components/new/sendInviteLink/GetLinkFormGuest';
import RallySummaryForm from '@/components/new/sendInviteLink/RallySummaryForm';
import { useState } from 'react';
import {useSelector} from 'react-redux';

export default function SendInviteLink() {
  const [currContent, setCurrContent] = useState('Summary');
  const currentUser = useSelector((state) => state.user.data);

  return (
    <div>
      {currContent === 'Summary' ? (
        <RallySummaryForm setCurrContent={setCurrContent} />
      ) : currContent === 'Link' && currentUser ? (
        <GetLinkFormUser />
      ) : (
        <GetLinkFormGuest />
      )}
    </div>
  );
}
