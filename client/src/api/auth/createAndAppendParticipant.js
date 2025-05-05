import { createUser } from './createUser';
import { appendParticipantToEvent } from './appendParticipantToEvent';

export const createAndAppendParticipant = async ({
  name,
  email,
  phone,
  eventUuid,
}) => {
  try {
    // First create the user
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
      console.log('Using Event UUID:', eventUuid);
      const eventUser = await appendParticipantToEvent(
        eventUuid,
        userUuid,
        userTimes
      );

      return {
        ...userResponse,
        eventUser,
      };
    }

    // If user creation failed, throw the error
    throw userResponse;
  } catch (error) {
    console.error('Error in createAndAppendOrganizer:', error);
    throw {
      status: 'ERROR',
      error:
        error.response?.data?.error ||
        'Failed to create user and add as organizer',
    };
  }
};
