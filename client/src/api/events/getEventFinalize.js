import axios from 'axios';

export const getEventFinalize = async (uuid) => {
  try {
    const response = await axios.get(`/api/events/${uuid}/finalize-options`);
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
