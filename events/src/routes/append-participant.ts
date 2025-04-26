import express, { Request, Response } from 'express';
import { BadRequestError } from '../errors/bad-request-error';
import { addUserToEvent } from '../services/eventService';

const router = express.Router();

router.post(
  '/api/events/append-participant',
  async (req: Request, res: Response) => {
    const { eventId, userId } = req.body;

    if (!eventId || !userId) {
      throw new BadRequestError('Event ID and User ID are required');
    }

    try {
      const eventUser = await addUserToEvent(eventId, userId, 'participant');
      res.status(201).send(eventUser);
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new BadRequestError('Failed to add participant to event');
    }
  }
);

export { router as appendParticipantRouter };
