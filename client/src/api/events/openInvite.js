// client/api/auth/getCurrentUser.ts
import api from '@/utils/axios';

export async function openInvite({ token }) {
  const response = await api.post('/events/invite/open', token);
  return response.data;
}
