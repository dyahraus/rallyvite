import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { findEventAndConvert } from '@/api/events/findEvent';

// Types based on backend models
interface Location {
  id?: number;
  name: string;
  address: string;
  city: string;
  locationState: string;
  zip: string;
  country: string;
  latitude: string;
  longitude: string;
  googlePlaceId: string;
  source: string;
  dates: {
    date: Date;
    times: string[];
  }[];
}

interface EventUser {
  name: string;
  email: string;
  phone: string;
  profilePicture: string;
}

interface GetTogether {
  name: string;
  description: string;
  duration: string;
  eventUuid: string;
  locations: Location[];
  selectedLocation: Location;
  users: EventUser[];
}

interface MinimalEvent {
  eventUuid: string;
  name: string;
  isAwaitingResponse: boolean;
  rsvpDeadline?: string;
}

interface FullEventDetails {
  [eventUuid: string]: GetTogether;
}

interface EventsState {
  pendingEvents: MinimalEvent[];
  fullEventDetails: FullEventDetails;
  loadingEventIds: string[];
}

const initialState: EventsState = {
  pendingEvents: [],
  fullEventDetails: {},
  loadingEventIds: [],
};

export const fetchPendingEvents = createAsyncThunk(
  'events/fetchPendingEvents',
  async () => {
    const response = await axios.get('/api/events/pending');
    return response.data as MinimalEvent[];
  }
);

export const fetchFullEventDetails = createAsyncThunk(
  'events/fetchFullEventDetails',
  async (eventUuid: string, { getState }) => {
    const state = getState() as { events: EventsState };
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
  reducers: {},
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

export default eventsSlice.reducer;
