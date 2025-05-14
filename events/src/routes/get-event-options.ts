import express from 'express';
import { BadRequestError } from '../errors/bad-request-error';
import { findEventByUuid } from '../services/eventService';
import { getEventOptions } from '../services/eventService';

const router = express.Router();

router.get('/api/events/:uuid/finalize-options', async (req, res) => {
  const event = await findEventByUuid(req.params.uuid);
  if (!event) throw new BadRequestError('Event not found');

  try {
    const options = await getEventOptions(event.id, event.duration);
    res.status(200).send(options.slice(0, 5)); // Top 5
  } catch (err) {
    console.error('Error getting event finalization options:', err);
    throw new BadRequestError('Could not get finalization options');
  }
});

export { router as finalizeOptionsRouter };
