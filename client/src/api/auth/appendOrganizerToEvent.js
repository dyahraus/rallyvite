import axios from 'axios';

export const appendOrganizerToEvent = async (eventUuid, userUuid) => {
  try {
    const response = await axios.post('/api/events/append-organizer', {
      eventUuid,
      userUuid,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to add organizer to event'
    );
  }
};
