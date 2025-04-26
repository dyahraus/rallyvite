import pool from '../config/db';
import { Location } from '../models/location';

export const createEventLocation = async (
  eventId: number,
  locationId: number
): Promise<void> => {
  console.log('Creating event location relationship:', { eventId, locationId });

  const result = await pool.query(
    `INSERT INTO event_locations (event_id, location_id)
     VALUES ($1, $2)
     ON CONFLICT (event_id, location_id) DO NOTHING
     RETURNING *`,
    [eventId, locationId]
  );

  console.log('Event location relationship created:', result.rows[0]);
};

export const getLocationsForEvent = async (
  eventId: number
): Promise<Location[]> => {
  const result = await pool.query<Location>(
    `SELECT l.* FROM locations l
     JOIN event_locations el ON l.id = el.location_id
     WHERE el.event_id = $1`,
    [eventId]
  );
  return result.rows;
};
