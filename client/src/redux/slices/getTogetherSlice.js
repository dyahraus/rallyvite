// src/redux/slices/getTogetherSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Dummy inital state for dev

// name: 'Pickle and Beers',
// description: 'Great time at pickle and beers',
// locations: [
//   {
//     name: 'Bowlmor',
//     address: '10123 N Wolfe Rd #20, Cupertino, CA 95014',
//     dates: [
//       {
//         date: new Date(),
//         times: [],
//       },
//     ],
//   },
//   {
//     name: 'No Location Selected', // Special "none" location
//     address: '',
//     dates: [
//       {
//         date: new Date(),
//         times: [],
//       },
//     ],
//   },
//   // Add other locations
// ],
// duration: '2.5 hours',
// activeStep: 'name', // 'name', 'description', 'duration'
// });

const initialState = {
  name: '',
  nameCompleted: false,
  description: '',
  descriptionCompleted: false,
  duration: '',
  durationCompleted: false,
  nameSectionCompleted: false,
  locationSectionCompleted: false,
  linkSectionCompleted: false,
  eventUuid: '',
  locations: [
    {
      name: 'No Location Selected',
      address: '',
      city: '',
      locationState: '',
      zip: '',
      country: '',
      dates: [],
      latitude: '',
      longitude: '',
      googlePlaceId: '',
      source: '',
    },
  ],

  selectedLocation: {
    name: 'No Location Selected',
    address: '',
    city: '',
    locationState: '',
    zip: '',
    country: '',
    dates: [],
    latitude: '',
    longitude: '',
    googlePlaceId: '',
    source: '',
  },
  users: [
    {
      name: 'You',
      email: '',
      phone: '',
      profilePicture: '',
    },
  ],
};

const getTogetherSlice = createSlice({
  name: 'getTogether',
  initialState,
  reducers: {
    setGetTogether: (state, action) => {
      return { ...state, ...action.payload };
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setNameCompleted: (state, action) => {
      state.nameCompleted = action.payload;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
    setDescriptionCompleted: (state, action) => {
      state.descriptionCompleted = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setDurationCompleted: (state, action) => {
      state.durationCompleted = action.payload;
    },
    setNameSectionCompleted: (state, action) => {
      state.nameSectionCompleted = action.payload;
    },
    setLocationSectionCompleted: (state, action) => {
      state.locationSectionCompleted = action.payload;
    },
    setLinkSectionCompleted: (state, action) => {
      state.locationSectionCompleted = action.payload;
    },
    setLocation: (state, action) => {
      const locationData = action.payload;
      const {
        name,
        address,
        city,
        locationState,
        zip,
        latitude,
        longitude,
        googlePlaceId,
        source,
      } = locationData;

      const locationExists = state.locations.some(
        (location) => location.name === name
      ); // Check if location already exists by name

      if (locationExists) {
        // Update the existing location
        state.locations = state.locations.map((location) =>
          location.name === name
            ? {
                ...location,
                address: address || location.address, // Only update if new data is available
                city: city || location.city,
                state: locationState || location.state,
                zip: zip || location.zip,
                latitude: latitude || location.latitude,
                longitude: longitude || location.longitude,
                googlePlaceId: googlePlaceId || location.googlePlaceId,
                source: source || location.source,
              }
            : location
        );
      } else {
        // Add a new location to the list
        state.locations.push({
          name,
          address,
          city,
          locationState,
          zip,
          latitude,
          longitude,
          googlePlaceId,
          source,
          dates: [],
        });
      }
    },
    setTimes: (state, action) => {
      const { selectedDate, selectedSlots, locationName } = action.payload;
      console.log('[REDUX_DEBUG] setTimes reducer called with:', {
        selectedDate,
        selectedSlots,
        locationName,
        currentLocations: state.locations.map((loc) => ({
          name: loc.name,
          dates: loc.dates.map((d) => d.date),
        })),
      });

      // Find the location that matches selectedLocation
      const locationIndex = state.locations.findIndex(
        (location) => location.name === locationName
      );

      if (locationIndex === -1) {
        console.log('[REDUX_DEBUG] Location not found:', locationName);
        return;
      }

      // Normalize the date to midnight UTC to avoid timezone issues
      const normalizedDate = new Date(selectedDate);
      normalizedDate.setUTCHours(0, 0, 0, 0);
      const normalizedDateString = normalizedDate.toISOString();

      console.log('[REDUX_DEBUG] Normalized date:', {
        original: selectedDate,
        normalized: normalizedDateString,
      });

      // Find or create the date entry
      const dateIndex = state.locations[locationIndex].dates.findIndex(
        (date) => {
          const existingDate = new Date(date.date);
          existingDate.setUTCHours(0, 0, 0, 0);
          const existingDateString = existingDate.toISOString();
          console.log('[REDUX_DEBUG] Comparing dates:', {
            existing: existingDateString,
            normalized: normalizedDateString,
            matches: existingDateString === normalizedDateString,
          });
          return existingDateString === normalizedDateString;
        }
      );

      if (dateIndex === -1) {
        // Create new date entry
        console.log('[REDUX_DEBUG] Creating new date entry:', {
          date: normalizedDateString,
          times: selectedSlots,
        });
        state.locations[locationIndex].dates.push({
          date: normalizedDateString,
          times: selectedSlots,
        });
      } else {
        // Update existing date's times
        console.log('[REDUX_DEBUG] Updating existing date entry:', {
          dateIndex,
          oldTimes: state.locations[locationIndex].dates[dateIndex].times,
          newTimes: selectedSlots,
        });
        state.locations[locationIndex].dates[dateIndex].times = selectedSlots;
      }
    },
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    getTimesForLocationDate: (state, action) => {
      const selectedDate = action.payload;
      const location = state.locations.find(
        (loc) => loc.name === state.selectedLocation.name
      );

      if (location) {
        const date = location.dates.find((d) => d.date === selectedDate);
        if (date) {
          return date.times;
        }
      }
      return {};
    },
  },
});

export const {
  setGetTogether,
  setLocation,
  setTimes,
  setSelectedLocation,
  setName,
  setDescription,
  setDuration,
  setNameCompleted,
  setDescriptionCompleted,
  setDurationCompleted,
  setNameSectionCompleted,
  setLocationSectionCompleted,
  setLinkSectionCompleted,
  getTimesForLocationDate,
} = getTogetherSlice.actions;
export default getTogetherSlice.reducer;
