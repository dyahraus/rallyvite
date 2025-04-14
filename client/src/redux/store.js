// store.js
import { configureStore } from '@reduxjs/toolkit';
import getTogetherReducer from './slices/getTogetherSlice';
import userSliceReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    getTogether: getTogetherReducer,
    user: userSliceReducer,
  },
});
