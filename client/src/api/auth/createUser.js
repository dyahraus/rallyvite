import axios from 'axios';

export const createUser = async ({ name, email, phone }) => {
  try {
    const response = await axios.post('/api/users/createuser', {
      name,
      email,
      phone,
    });

    // If we get a successful response with EXISTING_USER status
    if (response.data.status === 'EXISTING_USER') {
      // Call login endpoint with the same credentials
      const loginResponse = await axios.post('/api/users/login', {
        email,
        phone,
      });
      return {
        status: 'EXISTING_USER',
        user: loginResponse.data.user,
        jwt: loginResponse.data.jwt,
        sessionToken: loginResponse.data.sessionToken,
        magicLinkToken: loginResponse.data.magicLinkToken,
      };
    }

    // If we get a successful response with new user
    return {
      status: 'SUCCESS',
      user: {
        uuid: response.data.userUuid,
        jwt: response.data.jwt,
        sessionToken: response.data.sessionToken,
        magicLinkToken: response.data.magicLinkToken,
      },
    };
  } catch (err) {
    // Handle unexpected errors
    throw {
      status: 'ERROR',
      error: err.response?.data?.error || 'An unexpected error occurred',
    };
  }
};
