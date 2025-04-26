import express, { Request, Response } from 'express';
import { BadRequestError } from '../errors/bad-request-error';
import { addUserToEvent } from '../services/eventService';
import { findEventByUuid } from '../services/eventService';
import { findUserByUuid } from '../services/userService';

const router = express.Router();

router.post(
  '/api/events/append-organizer',
  async (req: Request, res: Response) => {
    const { eventUuid, userUuid } = req.body;

    console.log('Event UUID:', eventUuid);
    console.log('User UUID:', userUuid);

    if (!eventUuid || !userUuid) {
      throw new BadRequestError('Event UUID and User UUID are required');
    }

    try {
      const event = await findEventByUuid(eventUuid);
      const user = await findUserByUuid(userUuid);
      if (!event || !user) {
        throw new BadRequestError('Event or User could not be found');
      }

      const eventUser = await addUserToEvent(event.id, user.id, 'organizer');
      res.status(201).send(eventUser);
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new BadRequestError('Failed to add organizer to event');
    }
  }
);

export { router as appendOrganizerRouter };
