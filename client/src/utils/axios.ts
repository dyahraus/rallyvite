// client/utils/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api', // optionally set from .env
  withCredentials: true, // important if using cookies/sessions
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    console.error('API Error:', error?.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
