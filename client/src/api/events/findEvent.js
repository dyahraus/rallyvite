import axios from 'axios';

export const findEventAndConvert = async (uuid) => {
  try {
    const response = await axios.get(`/api/events/find/${uuid}`);
    const event = response.data;

    // Convert event to getTogether format
    const getTogether = {
      name: event.name,
      description: event.description || '',
      duration: event.duration || '',
      eventUuid: event.uuid,
      locations: event.locations?.map((location) => ({
        name: location.name,
        address: location.address,
        city: location.city,
        locationState: location.state,
        zip: location.zip,
        country: location.country,
        dates:
          location.dates?.map((date) => ({
            date: new Date(date.date),
            times: date.times.reduce((acc, time) => {
              // Convert time format from "HH:MM" to "HH-MM" for the frontend
              const [hours, minutes] = time.split(':');
              acc[`${hours}-${minutes}`] = true;
              return acc;
            }, {}),
          })) || [],
        latitude: location.latitude,
        longitude: location.longitude,
        googlePlaceId: location.googlePlaceId,
        source: location.source,
      })) || [
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
      users: event.users?.map((user) => ({
        name: user.name,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
      })) || [
        {
          name: 'You',
          email: '',
          phone: '',
          profilePicture: '',
        },
      ],
    };

    return {
      status: 'SUCCESS',
      getTogether,
    };
  } catch (error) {
    return {
      status: 'ERROR',
      error: error.response?.data?.message || 'Failed to find event',
    };
  }
};
