import express from 'express';
import { pool } from '../config/db';
import { BadRequestError } from '../errors/bad-request-error';
import { findEventByUuid } from '../services/eventService';

const router = express.Router();

router.put('/api/events/finalize-event', async (req, res) => {
  try {
    const { eventUuid, eventDateId, locationId, startTime, endTime, timeIds } =
      req.body;

    const event = await findEventByUuid(eventUuid);
    if (!event) throw new Error('Event not found');

    await pool.query(
      `
      UPDATE events
      SET 
        final_event_date_id = $1,
        final_location_id = $2,
        final_start_time = $3,
        final_end_time = $4,
        status = 2
      WHERE uuid = $5
      `,
      [eventDateId, locationId, startTime, endTime, eventUuid]
    );

    const updatedEvent = await findEventByUuid(eventUuid);
    console.log(updatedEvent);

    res.status(200).send({ event: updatedEvent });
  } catch (err) {
    console.error('Error finalizing event:', err);
    throw new BadRequestError('Could not finalize event');
  }
});

export { router as finalizeEventDetailsRouter };
