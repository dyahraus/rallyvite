import axios from 'axios';

export const editUser = async (userData) => {
  try {
    const response = await axios.put('/auth/edit-user', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to update user' };
  }
};
