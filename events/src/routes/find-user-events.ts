import express, { Request, Response } from 'express';
import { pool } from '../config/db';
import { Event } from '../models/event';
import { EventUser } from '../models/eventUser';
import { EventDate } from '../models/eventDate';
import { EventTime } from '../models/eventTime';
import { Location } from '../models/location';
import { getEventDatesForEvent } from '../services/eventDateService';
import { getTimesForEventDate } from '../services/eventDateService';
import { getLocationsForEvent } from '../services/eventLocationService';
import { getUsersForEvent } from '../services/eventUserService';

interface EventWithDetails extends Event {
  role: string;
  locations: (Location & {
    dates: {
      date: Date;
      times: {
        time: string;
        id: number;
      }[];
    }[];
  })[];
  users: EventUser[];
}

const router = express.Router();

router.get('/api/events/user', async (req: Request, res: Response) => {
  try {
    const userId = req.currentUser?.id;

    // First get all events for the user with their role
    const eventsResult = await pool.query<Event & { role: string }>(
      `SELECT e.*, eu.role
       FROM events e
       JOIN events_users eu ON e.id = eu.event_id
       WHERE eu.user_id = $1
       ORDER BY e.date_created DESC`,
      [userId]
    );

    // For each event, fetch all related data
    const eventsWithDetails = await Promise.all(
      eventsResult.rows.map(async (event) => {
        // Fetch all related data in parallel
        const [locations, dates, users] = await Promise.all([
          getLocationsForEvent(event.id),
          getEventDatesForEvent(event.id),
          getUsersForEvent(event.id),
        ]);

        // Fetch times for each date
        const datesWithTimes = await Promise.all(
          dates.map(async (date) => {
            const times = await getTimesForEventDate(date.id);
            return {
              ...date,
              times: times.map((time) => ({
                time: time.time,
                id: time.id,
              })),
            };
          })
        );

        // Combine all the data
        const eventWithDetails: EventWithDetails = {
          ...event,
          role: event.role,
          locations: locations.map((location) => ({
            ...location,
            dates: datesWithTimes
              .filter((date) => date.location_id === location.id)
              .map((date) => ({
                date: date.date,
                times: date.times,
              })),
          })),
          users,
        };

        return eventWithDetails;
      })
    );

    res.json(eventsWithDetails);
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as findUserEventsRouter };
