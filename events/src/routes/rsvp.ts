// 2 Cases, 1 in which current user is defined (Slide 27, skip 28?)

// Second in which it is not
// Enter slide 28, called on submit

import express, { Request, Response } from 'express';
import { currentUser } from '../middlewares/current-user';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { findEventByUuid } from '../services/eventService';
import pool from '../config/db';

const router = express.Router();

router.post('/api/events/rsvp', async (req: Request, res: Response) => {
  console.log('Received RSVP submission request');
  const { event_uuid, selected_date, selected_times, response } = req.body;
  console.log('Request body:', {
    event_uuid,
    selected_date,
    selected_times,
    response,
  });

  if (!req.currentUser) {
    console.log('No authenticated user found');
    throw new NotAuthorizedError();
  }

  if (!event_uuid) {
    console.log('Invalid event_uuid provided');
    res.status(400).send({ error: 'Event UUID is required.' });
    return;
  }

  if (!selected_date) {
    console.log('Invalid selected_date provided');
    res.status(400).send({ error: 'Selected date is required.' });
    return;
  }

  if (!event_uuid || !selected_date || !response) {
    res.status(400).send({ error: 'Missing required fields.' });
    return;
  }

  if (
    !selected_times ||
    !Array.isArray(selected_times) ||
    selected_times.length === 0
  ) {
    console.log('Invalid selected_times provided');
    res.status(400).send({ error: 'At least one time must be selected.' });
    return;
  }

  try {
    // Find the event
    const event = await findEventByUuid(event_uuid);
    console.log('Found event:', event.id);

    // Start a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Upsert user response into events_users
      await client.query(
        `
        INSERT INTO events_users (event_id, user_id, response, rsvp_status, role, last_modified)
        VALUES ($1, $2, $3, TRUE, 'participant', NOW())
        ON CONFLICT (event_id, user_id)
        DO UPDATE SET response = $3, rsvp_status = TRUE, last_modified = NOW()
        `,
        [event.id, req.currentUser.id, response]
      );

      // Always delete previous time selections
      await client.query(
        `DELETE FROM user_event_times 
         WHERE user_id = $1 
         AND event_time_id IN (
           SELECT id FROM event_times 
           WHERE event_date_id IN (
             SELECT id FROM event_dates 
             WHERE event_id = $2
           )
         )`,
        [req.currentUser.id, event.id]
      );

      // Only re-insert if response is yes or maybe
      if (
        response !== 'no' &&
        Array.isArray(selected_times) &&
        selected_times.length > 0
      ) {
        const values = selected_times
          .map(
            (eventTimeId) =>
              `(${req?.currentUser?.id}, ${eventTimeId}, 'available', NOW())`
          )
          .join(',');

        await client.query(
          `INSERT INTO user_event_times (user_id, event_time_id, status, created_at)
           VALUES ${values}`
        );
      }

      await client.query('COMMIT');
      res.status(201).send({ message: 'RSVP submitted successfully' });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error submitting RSVP:', err);
    res.status(500).send({ error: 'Error submitting RSVP' });
  }
});

export { router as rsvpRouter };
