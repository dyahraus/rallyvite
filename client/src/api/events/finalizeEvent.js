// @/api/events/finalizeEvent.js
import axios from 'axios';

export const finalizeEvent = async (payload) => {
  const res = await axios.put('/api/events/finalize-event', payload);
  return res.data;
};
