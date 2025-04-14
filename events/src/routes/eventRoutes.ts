import express from 'express';
import { EventService } from '../services/eventService';
import { validateEventId } from '../middlewares/validateEventId';
import { validate as uuidValidate } from 'uuid';
import { NotFoundError } from '../errors/not-found-error';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();
const eventService = new EventService();

// Append user to event
router.post('/:id/users', validateEventId, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!uuidValidate(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const eventUser = await eventService.appendUserToEvent(id, userId, role);

    res.status(201).json(eventUser);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    if (
      error instanceof Error &&
      error.message.includes('Invalid UUID format')
    ) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
