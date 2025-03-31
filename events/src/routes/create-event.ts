import express, { Request, Response } from 'express';
import { currentUser } from '..//middlewares/current-user';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { createEvent } from '../services/eventService';
import { addUserToEvent } from '../services/eventUserService';
import {
  createPlace,
  findPlaceByNameAndAddress,
} from '../services/placeService';

interface LocationPayload {
  locationName: string;
  address: string;
  source: 'google' | 'manual';
}

const router = express.Router();

router.post(
  '/api/events/create',
  currentUser,
  async (req: Request, res: Response) => {
    if (!req.currentUser) {
      throw new NotAuthorizedError();
    }

    const { name, description, location } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      res.status(400).send({ error: 'Event name is required.' });
      return;
    }

    let placeId: number | null = null;
    let newPlace = null;

    if (location) {
      const existingPlace = await findPlaceByNameAndAddress(
        location.locationName,
        location.address
      );
      if (existingPlace) {
        placeId = existingPlace.id;
      } else {
        if (location.source === 'google') {
          // Create a new place record
          newPlace = await createPlace({
            status: 1,
            type:
              location.source === 'google' ? 'google_place' : 'manual_entry',
            name: location.locationName,
            description: null,
            address1: location.address,
            address2: '',
            city: location.cityStateZip?.split(',')[0]?.trim() || '',
            state:
              location.cityStateZip?.split(',')[1]?.split(' ')[0]?.trim() || '',
            zip: location.cityStateZip?.split(' ')[1]?.trim() || '',
            country: 'US',
            latitude: location.latitude ?? null,
            longitude: location.longitude ?? null,
            googlePlaceId: location.googlePlaceId ?? null,
            websiteUrl: '',
            pageContent: '',
            rating: null,
            ratingsCount: 0,
            businessHoursJson: null,
          });
        } else {
          // Create a new place record
          newPlace = await createPlace({
            status: 1,
            type:
              location.source === 'google' ? 'google_place' : 'manual_entry',
            name: location.locationName,
            description: null,
            address1: location.address,
            address2: '',
            city: '', // You can parse city/state/zip from frontend if desired
            state: '',
            zip: '',
            country: 'US',
            latitude: null,
            longitude: null,
            googlePlaceId: location.source === 'google' ? 'unknown' : null, // Could be provided by frontend
            websiteUrl: '',
            pageContent: '',
            rating: null,
            ratingsCount: 0,
            businessHoursJson: null,
          });
        }
        placeId = newPlace.id;
      }
    }

    try {
      const newEvent = await createEvent({
        name: name.trim(),
        description: description?.trim() || null,
      });

      await addUserToEvent({
        eventId: newEvent.id,
        userId: req.currentUser.id,
        type: 'organizer',
        rolesJson: { organizer: true },
      });

      res.status(201).send(newEvent);
    } catch (err) {
      console.error('Error creating event:', err);
      res.status(500).send({ error: 'Error creating event' });
    }
  }
);

export { router as createUserRouter };
