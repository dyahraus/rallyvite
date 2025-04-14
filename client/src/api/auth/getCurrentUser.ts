// client/api/auth/getCurrentUser.ts
import api from '@/utils/axios';

export async function getCurrentUser() {
  const response = await api.get('/users/current-user');
  return response.data;
}
