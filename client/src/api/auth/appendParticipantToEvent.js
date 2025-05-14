import axios from 'axios';

export const appendParticipantToEvent = async (
  userUuid,
  event,
  rsvpResponse
) => {
  try {
    const response = await axios.post('/api/events/append-participant', {
      userUuid,
      event,
      rsvpResponse,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to add participant to event'
    );
  }
};
