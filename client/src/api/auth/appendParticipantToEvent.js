import axios from 'axios';

export const appendParticipantToEvent = async (eventId, userId) => {
  try {
    const response = await axios.post('/api/events/append-participant', {
      eventId,
      userId,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to add participant to event'
    );
  }
};
