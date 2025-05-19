import express, { Request, Response } from 'express';
import { BadRequestError } from '../errors/bad-request-error';
import { addUserToEvent } from '../services/eventService';
import { findEventByUuid } from '../services/eventService';
import { findUserByUuid } from '../services/userService';
import { addUserEventTimes } from '../services/eventUserService';

const router = express.Router();

router.post(
  '/api/events/append-participant',
  async (req: Request, res: Response) => {
    const { userUuid, event, rsvpResponse } = req.body;
    console.log(req.body);
    console.log(event);
    const eventUuid = event.uuid;

    console.log('Event UUID:', eventUuid);
    console.log('User UUID:', userUuid);

    if (!eventUuid || !userUuid) {
      throw new BadRequestError('Event UUID and User UUID are required');
    }

    try {
      const dbEvent = await findEventByUuid(eventUuid);
      const user = await findUserByUuid(userUuid);
      if (!dbEvent || !user) {
        throw new BadRequestError('Event or User could not be found');
      }

      try {
        const eventUser = await addUserToEvent(
          dbEvent.id,
          user.id,
          'participant',
          rsvpResponse
        );

        await addUserEventTimes(user.id, event);
        // Set the user times
        res.status(201).send(eventUser);
      } catch (error) {
        if (error instanceof BadRequestError) {
          throw error;
        }
        throw new BadRequestError('Failed to add participant to event');
      }
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new BadRequestError('Failed to add participant to event');
    }
  }
);

export { router as appendParticipantRouter };
