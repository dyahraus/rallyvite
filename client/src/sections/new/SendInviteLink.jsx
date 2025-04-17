import GetLinkForm from '@/components/new/sendInviteLink/GetLinkForm';
import RallySummaryForm from '@/components/new/sendInviteLink/RallySummaryForm';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

export default function SendInviteLink({ getTogether, setBottomAction }) {
  const [currContent, setCurrContent] = useState('Summary');

  return (
    <div>
      {currContent === 'Summary' ? (
        <RallySummaryForm
          getTogether={getTogether}
          setCurrContent={setCurrContent}
          setBottomAction={setBottomAction}
        />
      ) : (
        <GetLinkForm
          getTogetherName={getTogether.name}
          setBottomAction={setBottomAction}
        />
      )}
    </div>
  );
}
