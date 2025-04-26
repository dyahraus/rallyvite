// client/api/auth/getCurrentUser.ts
import api from '@/utils/axios';

export async function createEvent(data) {
  const response = await api.post('/events/create', data);
  return response.data;
}
