// mockEvents.ts

export const mockPendingEvents = [
  {
    eventUuid: 'uuid-1',
    name: 'Team Lunch',
    isAwaitingResponse: true,
    rsvpDeadline: '2025-05-15',
  },
  {
    eventUuid: 'uuid-2',
    name: 'Strategy Session',
    isAwaitingResponse: true,
    rsvpDeadline: '2025-05-20',
  },
];

export const mockFullEventDetails = {
  'uuid-1': {
    name: 'Team Lunch',
    description: 'Let’s grab tacos downtown',
    duration: '60',
    eventUuid: 'uuid-1',
    locations: [
      {
        name: 'Taco Spot',
        address: '123 Food Street',
        city: 'Los Angeles',
        locationState: 'CA',
        zip: '90001',
        country: 'USA',
        latitude: '34.0522',
        longitude: '-118.2437',
        googlePlaceId: 'abc123',
        source: 'manual',
        dates: [
          {
            date: new Date('2025-05-18'),
            times: {
              '12-00': true,
              '12-15': true,
              '12-30': true,
            },
          },
        ],
      },
    ],
    selectedLocation: {
      name: 'Taco Spot',
      address: '123 Food Street',
      city: 'Los Angeles',
      locationState: 'CA',
      zip: '90001',
      country: 'USA',
      latitude: '34.0522',
      longitude: '-118.2437',
      googlePlaceId: 'abc123',
      source: 'manual',
      dates: [
        {
          date: new Date('2025-05-18'),
          times: {
            '12-00': true,
            '12-15': true,
            '12-30': true,
          },
        },
      ],
    },
    users: [
      {
        name: 'Alice',
        email: 'alice@example.com',
        phone: '123-456',
        profilePicture: '',
      },
    ],
  },

  'uuid-2': {
    name: 'Strategy Session',
    description: 'Big ideas only',
    duration: '90',
    eventUuid: 'uuid-2',
    locations: [
      {
        name: 'WeWork Boardroom',
        address: '456 Startup Ave',
        city: 'Santa Monica',
        locationState: 'CA',
        zip: '90401',
        country: 'USA',
        latitude: '34.0195',
        longitude: '-118.4912',
        googlePlaceId: 'xyz456',
        source: 'manual',
        dates: [
          {
            date: new Date('2025-05-21'),
            times: {
              '15-00': true,
              '15-15': true,
              '15-30': true,
              '15-45': true,
            },
          },
        ],
      },
    ],
    selectedLocation: {
      name: 'WeWork Boardroom',
      address: '456 Startup Ave',
      city: 'Santa Monica',
      locationState: 'CA',
      zip: '90401',
      country: 'USA',
      latitude: '34.0195',
      longitude: '-118.4912',
      googlePlaceId: 'xyz456',
      source: 'manual',
      dates: [
        {
          date: new Date('2025-05-21'),
          times: {
            '15-00': true,
            '15-15': true,
            '15-30': true,
            '15-45': true,
          },
        },
      ],
    },
    users: [
      {
        name: 'Bob',
        email: 'bob@example.com',
        phone: '789-123',
        profilePicture: '',
      },
    ],
  },
};
