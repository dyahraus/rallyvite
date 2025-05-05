import axios from 'axios';

export const findUserEvents = async () => {
  try {
    const response = await axios.get(`/api/events/user`);
    console.log(response);
    const event = response.data;

    return {
      status: 'SUCCESS',
      event,
    };
  } catch (error) {
    return {
      status: 'ERROR',
      error: error.response?.data?.message || 'Failed to find event',
    };
  }
};
