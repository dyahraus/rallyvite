import express, { Request, Response } from 'express';
import { findEventByUuid } from '../services/eventService';
import {
  getEventDatesForEvent,
  getTimesForEventDate,
} from '../services/eventDateService';
import { getUsersForEvent } from '../services/eventUserService';
import { getLocationsForEvent } from '../services/eventLocationService';
import { BadRequestError } from '../errors/bad-request-error';
import { EventDate } from '../models/eventDate';
import { EventUser } from '../models/eventUser';
import { Location } from '../models/location';
import { EventTime } from '../models/eventTime';
import { User } from '../models/user';

interface EventWithDetails {
  id: number;
  uuid: string;
  name: string;
  description: string | null;
  duration: string | null;
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

router.get('/api/events/find/:uuid', async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const event = await findEventByUuid(uuid);

    // Fetch all related data
    const [locations, dates, users] = await Promise.all([
      getLocationsForEvent(event.id),
      getEventDatesForEvent(event.id),
      getUsersForEvent(event.id),
    ]);

    // Fetch times for each date
    const datesWithTimes = await Promise.all(
      dates.map(async (date) => {
        const times = await getTimesForEventDate(date.id);
        console.log(times);
        console.log(date);
        times.forEach((element) => {
          console.log(element.time);
          console.log(element.id);
        });
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

    res.status(200).send(eventWithDetails);
  } catch (error) {
    if (error instanceof BadRequestError) {
      throw error;
    }
    throw new BadRequestError('Failed to find event');
  }
});

export { router as findEventRouter };
