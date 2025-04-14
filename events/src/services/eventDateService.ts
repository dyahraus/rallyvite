import pool from '../config/db';
import { EventDate } from '../models/eventDate';
import { EventTime } from '../models/eventTime';

export const createEventDate = async (
  eventId: number,
  locationId: number | null,
  date: Date
): Promise<EventDate> => {
  console.log('Creating event date with:', { eventId, locationId, date });
  const result = await pool.query<EventDate>(
    `INSERT INTO event_dates (event_id, location_id, date, status)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [eventId, locationId, date, 1]
  );
  console.log('Event date created:', result.rows[0]);
  return result.rows[0];
};

export const createEventTime = async (
  eventDateId: number,
  time: string
): Promise<EventTime> => {
  console.log('Creating event time:', { eventDateId, time });
  const result = await pool.query<EventTime>(
    `INSERT INTO event_times (event_date_id, time)
     VALUES ($1, $2)
     RETURNING *`,
    [eventDateId, time]
  );
  console.log('Event time created:', result.rows[0]);
  return result.rows[0];
};

export const createEventDateWithTimes = async (
  eventId: number,
  locationId: number | null,
  date: Date,
  times: string[]
): Promise<{ eventDate: EventDate; eventTimes: EventTime[] }> => {
  console.log('Creating event date with times:', {
    eventId,
    locationId,
    date,
    times,
  });
  const eventDate = await createEventDate(eventId, locationId, date);
  console.log('Event date created, proceeding with times');

  const eventTimes = await Promise.all(
    times.map((time) => createEventTime(eventDate.id, time))
  );
  console.log('All event times created successfully');

  return { eventDate, eventTimes };
};

export const getEventDatesForEvent = async (
  eventId: number
): Promise<EventDate[]> => {
  const result = await pool.query<EventDate>(
    `SELECT * FROM event_dates WHERE event_id = $1`,
    [eventId]
  );
  return result.rows;
};
