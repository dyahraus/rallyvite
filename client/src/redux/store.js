// store.js
import { configureStore } from '@reduxjs/toolkit';
import getTogetherReducer from './slices/getTogetherSlice';
import userSliceReducer from './slices/userSlice';
import eventsSliceReducer from './slices/eventsSlice';

export const store = configureStore({
  reducer: {
    getTogether: getTogetherReducer,
    user: userSliceReducer,
    events: eventsSliceReducer,
  },
});
