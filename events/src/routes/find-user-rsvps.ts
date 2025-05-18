import express, { Request, Response } from 'express';
import { pool } from '../config/db';
import { Event } from '../models/event';
import {
  getEventDatesForEvent,
  getTimesForEventDate,
} from '../services/eventDateService';
import { getLocationsForEvent } from '../services/eventLocationService';
import { getUsersForEvent } from '../services/eventUserService';
import { Location } from '../models/location';
import { User } from '../models/user';

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
  users: User[];
}

const router = express.Router();

router.get(
  '/api/events/user/unresponded',
  async (req: Request, res: Response) => {
    try {
      const userId = req.currentUser?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const eventsResult = await pool.query<Event & { role: string }>(
        `SELECT e.*, eu.role
       FROM events e
       JOIN events_users eu ON e.id = eu.event_id
       WHERE eu.user_id = $1
         AND (e.status = 1 OR e.status = 2)
         AND eu.rsvpStatus = false
       ORDER BY e.date_created DESC`,
        [userId]
      );

      const eventsWithDetails = await Promise.all(
        eventsResult.rows.map(async (event) => {
          const [locations, dates, users] = await Promise.all([
            getLocationsForEvent(event.id),
            getEventDatesForEvent(event.id),
            getUsersForEvent(event.id),
          ]);

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

          const eventWithDetails: EventWithDetails = {
            ...event,
            role: event.role,
            status: event.status,
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
      console.error('Error fetching unresponded user events:', error);
      res.status(500).send({ error: 'Internal server error' }); // .send instead of .json works too
    }
  }
);

export { router as findRSVPUserEventsRouter };
