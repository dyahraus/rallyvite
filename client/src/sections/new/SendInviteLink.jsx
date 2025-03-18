import GetLinkForm from '@/components/new/sendInviteLink/GetLinkForm';
import RallySummaryForm from '@/components/new/sendInviteLink/RallySummaryForm';

export default function SendInviteLink({ getTogether }) {
  return <RallySummaryForm getTogether={getTogether} />;
}
