import express, { Request, Response } from 'express';
import { currentUser } from '..//middlewares/current-user';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { createEvent } from '../services/eventService';
import { addUserToEvent } from '../services/eventUserService';

const router = express.Router();

router.post(
  '/api/events/create',
  currentUser,
  async (req: Request, res: Response) => {
    if (!req.currentUser) {
      throw new NotAuthorizedError();
    }

    const { name, description } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      res.status(400).send({ error: 'Event name is required.' });
      return;
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
