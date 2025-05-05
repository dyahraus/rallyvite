import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { findEventAndConvert } from '@/api/events/findEvent';

const initialState = {
  pendingEvents: [],
  fullEventDetails: {},
  loadingEventIds: [],
};

export const fetchPendingEvents = createAsyncThunk(
  'events/fetchPendingEvents',
  async () => {
    const response = await axios.get('/api/events/pending');
    return response.data;
  }
);

export const fetchFullEventDetails = createAsyncThunk(
  'events/fetchFullEventDetails',
  async (eventUuid, { getState }) => {
    const state = getState();
    if (state.events.fullEventDetails[eventUuid]) return null;

    const result = await findEventAndConvert(eventUuid);
    if (result.status === 'SUCCESS') {
      return {
        uuid: eventUuid,
        data: result.getTogether,
      };
    }
    throw new Error(result.error || 'Failed to fetch event details');
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setUserTimes: (state, action) => {
      const { eventUuid, selectedLocation, selectedDate, userSelectedSlots } =
        action.payload;
      console.log('setTimes reducer called with:', {
        selectedDate,
        userSelectedSlots,
      });

      // Find the location that matches selectedLocation
      const locationIndex = state.fullEventDetails[
        eventUuid
      ].locations.findIndex((location) => location.name === selectedLocation);

      if (locationIndex === -1) {
        console.log('Location not found');
        return;
      }

      // Normalize the date to midnight UTC to avoid timezone issues
      const normalizedDate = new Date(selectedDate);
      normalizedDate.setUTCHours(0, 0, 0, 0);
      const normalizedDateString = normalizedDate.toISOString();

      // Find or create the date entry
      const dateIndex = state.fullEventDetails[eventUuid].locations[
        locationIndex
      ].userDates.findIndex((date) => {
        const existingDate = new Date(date.date);
        existingDate.setUTCHours(0, 0, 0, 0);
        return existingDate.toISOString() === normalizedDateString;
      });

      if (dateIndex === -1) {
        // Create new date entry
        state.fullEventDetails[eventUuid].locations[
          locationIndex
        ].userDates.push({
          date: normalizedDateString,
          times: userSelectedSlots,
        });
        console.log('Created new date entry with times:', userSelectedSlots);
      } else {
        // Update existing date's times
        state.fullEventDetails[eventUuid].locations[locationIndex].userDates[
          dateIndex
        ].times = userSelectedSlots;
        console.log(
          'Updated existing date entry with times:',
          userSelectedSlots
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingEvents.fulfilled, (state, action) => {
        state.pendingEvents = action.payload;
      })
      .addCase(fetchFullEventDetails.pending, (state, action) => {
        state.loadingEventIds.push(action.meta.arg);
      })
      .addCase(fetchFullEventDetails.fulfilled, (state, action) => {
        const { uuid, data } = action.payload || {};
        if (uuid && data) {
          state.fullEventDetails[uuid] = data;
        }
        state.loadingEventIds = state.loadingEventIds.filter(
          (id) => id !== uuid
        );
      })
      .addCase(fetchFullEventDetails.rejected, (state, action) => {
        state.loadingEventIds = state.loadingEventIds.filter(
          (id) => id !== action.meta.arg
        );
      });
  },
});

export const { setUserTimes } = eventsSlice.actions;
export default eventsSlice.reducer;
