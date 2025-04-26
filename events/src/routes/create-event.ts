import express, { Request, Response } from 'express';
import { currentUser } from '../middlewares/current-user';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { createEvent } from '../services/eventService';
import { addUserToEvent } from '../services/eventService';
import {
  createLocation,
  findLocationByNameAndAddress,
} from '../services/locationService';
import { createEventDateWithTimes } from '../services/eventDateService';
import { createEventLocation } from '../services/eventLocationService';

interface LocationPayload {
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
  dates: Array<{
    date: string;
    times: Record<string, boolean>;
  }>;
}

const router = express.Router();

router.post('/api/events/create', async (req: Request, res: Response) => {
  console.log('Received create event request');
  const { name, description, duration, locations } = req.body;
  console.log('Request body:', { name, description, duration, locations });

  if (!name || typeof name !== 'string' || name.trim() === '') {
    console.log('Invalid name provided');
    res.status(400).send({ error: 'Event name is required.' });
    return;
  }

  try {
    // Create the event first
    console.log('Creating event with name:', name);
    console.log('Description:', description);
    console.log('Duration:', duration);
    console.log('Locations:', locations);
    console.log('Current user:', req.currentUser);

    const newEvent = await createEvent({
      name: name.trim(),
      description: description?.trim() || null,
      duration: duration?.trim() || null,
    });
    console.log('Event created successfully:', newEvent);

    // Add the current user as organizer
    if (req.currentUser) {
      console.log('Adding current user as organizer:', req.currentUser.id);
      await addUserToEvent(
        newEvent.id,
        Number(req.currentUser.id),
        'organizer'
      );
      console.log('User added as organizer successfully');
    }

    // Process each location
    if (locations && Array.isArray(locations)) {
      console.log('Processing locations:', locations.length);
      for (const location of locations) {
        if (location.name === 'No Location Selected') {
          console.log('Skipping "No Location Selected"');
          continue;
        }

        console.log('Processing location:', location.name);
        // Find or create location
        let locationId: number | null = null;
        const existingLocation = await findLocationByNameAndAddress(
          location.name,
          location.address
        );

        if (existingLocation) {
          console.log('Found existing location:', existingLocation.id);
          locationId = existingLocation.id;
        } else {
          console.log('Creating new location:', location.name);
          const newLocation = await createLocation({
            name: location.name,
            address: location.address,
            city: location.city,
            state: location.locationState,
            zip: location.zip,
            country: location.country,
            latitude: location.latitude ? parseFloat(location.latitude) : null,
            longitude: location.longitude
              ? parseFloat(location.longitude)
              : null,
            googlePlaceId: location.googlePlaceId,
            source: location.source,
            type:
              location.source === 'google' ? 'google_place' : 'manual_entry',
          });
          console.log('New location created:', newLocation.id);
          locationId = newLocation.id;
        }

        // Create event-location relationship
        if (locationId) {
          console.log('Creating event-location relationship');
          await createEventLocation(newEvent.id, locationId);
        }

        // Process dates and times for this location
        if (location.dates && Array.isArray(location.dates)) {
          console.log('Processing dates for location:', locationId);
          for (const dateData of location.dates) {
            if (!dateData.date || !dateData.times) {
              console.log('Skipping invalid date data');
              continue;
            }

            console.log('Creating event date:', dateData.date);
            // Convert date string to Date object
            const date = new Date(dateData.date);
            console.log('Date:', date);
            console.log('Date data:', dateData);

            // Convert times object to array of selected times (only those marked true)
            const selectedTimes = Object.entries(dateData.times)
              .filter(([_, isSelected]) => isSelected === true)
              .map(([time]) => {
                // Convert time format from "HH-MM" to "HH:MM"
                const [hours, minutes] = time.split('-');
                return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
              });
            console.log('Selected times:', selectedTimes);

            if (selectedTimes.length === 0) {
              console.log('No times selected for this date, skipping');
              continue;
            }

            // Create event date and times
            await createEventDateWithTimes(
              newEvent.id,
              locationId,
              date,
              selectedTimes
            );
            console.log('Event date and times created successfully');
          }
        }
      }
    }

    console.log('Event creation completed successfully');
    res.status(201).send(newEvent);
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).send({ error: 'Error creating event' });
  }
});

export { router as createEventRouter };
