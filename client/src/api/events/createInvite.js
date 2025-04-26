// client/api/auth/getCurrentUser.ts
import api from '@/utils/axios';

export async function createInvite({ eventUuid }) {
  const response = await api.post('/events/invite', { eventUuid });
  return response.data.url;
}
