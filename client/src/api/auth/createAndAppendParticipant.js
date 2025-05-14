import { createUser } from './createUser';
import { appendParticipantToEvent } from './appendParticipantToEvent';

export const createAndAppendParticipant = async ({
  name,
  email,
  phone,
  event,
  rsvpResponse,
}) => {
  try {
    // First create the user
    console.log('Creating User');
    const userResponse = await createUser({ name, email, phone });
    console.log('User Response:', userResponse);
    console.log('User Response Status:', userResponse.status);
    console.log('User Object:', userResponse.user);
    console.log('User UUID:', userResponse.user?.uuid);

    // If user creation was successful, add them as organizer
    if (
      userResponse.status === 'SUCCESS' ||
      userResponse.status === 'EXISTING_USER'
    ) {
      const userUuid = userResponse.user.uuid;
      console.log('Using User UUID:', userUuid);
      console.log('Using Event UUID:', event.uuid);
      const eventUser = await appendParticipantToEvent(
        userUuid,
        event,
        rsvpResponse
      );

      return {
        ...userResponse,
        eventUser,
      };
    }

    // If user creation failed, throw the error
    throw userResponse;
  } catch (error) {
    console.error('Error in createAndParticipant:', error);
    throw {
      status: 'ERROR',
      error:
        error.response?.data?.error ||
        'Failed to create user and add as participant',
    };
  }
};
