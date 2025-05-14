import express from 'express';
import { BadRequestError } from '../errors/bad-request-error';
import { findEventByUuid, getEventOptions } from '../services/eventService';

const router = express.Router();

router.get('/api/events/:uuid/finalize-options', async (req, res) => {
  try {
    const event = await findEventByUuid(req.params.uuid);
    if (!event) throw new BadRequestError('Event not found');

    const options = await getEventOptions(event.id, event.duration);
    const top20 = options.slice(0, 20);

    // Group into arrays of 5
    const grouped: Array<Array<(typeof options)[0]>> = [];
    for (let i = 0; i < top20.length; i += 5) {
      grouped.push(top20.slice(i, i + 5));
    }

    res.status(200).json(grouped);
  } catch (err) {
    console.error('Error getting event finalization options:', err);
    throw new BadRequestError('Could not get finalization options');
  }
});

export { router as finalizeOptionsRouter };
