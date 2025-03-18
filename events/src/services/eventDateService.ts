import pool from '../config/db';
import { EventDate } from '../models/eventDate';

export const createEventDate = async (
  eventDate: Omit<EventDate, 'id' | 'dateCreated' | 'lastModified'>
) => {
  const result = await pool.query<EventDate>(
    `INSERT INTO event_dates (event_id, status, date_start, date_end, time_zone, description, location, place_id, date_last_notification)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      eventDate.eventId,
      eventDate.status || 1,
      eventDate.dateStart,
      eventDate.dateEnd,
      eventDate.timeZone,
      eventDate.description,
      eventDate.location,
      eventDate.placeId,
      eventDate.dateLastNotification,
    ]
  );
  return result.rows[0];
};

export const getEventDatesForEvent = async (eventId: number) => {
  const result = await pool.query<EventDate>(
    `SELECT * FROM event_dates WHERE event_id = $1`,
    [eventId]
  );
  return result.rows;
};
