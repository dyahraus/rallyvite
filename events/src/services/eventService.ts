import pool from '../config/db';
import { Event } from '../models/event';
import { EventUser } from '../models/eventUser';
import { NotFoundError } from '../errors/not-found-error';
import { v4 as uuidv4 } from 'uuid'; // Import the uuid package
import { validate as uuidValidate } from 'uuid';

export const createEvent = async (event: {
  name: string;
  description?: string;
  duration?: string;
}) => {
  const result = await pool.query<Event>(
    `INSERT INTO events (uuid, name, description, duration, status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      uuidv4(),
      event.name,
      event.description ?? null,
      event.duration ?? null,
      1, // default status
    ]
  );
  return result.rows[0];
};

export const getAllEvents = async () => {
  const result = await pool.query<Event>('SELECT * FROM events');
  return result.rows;
};

export const findEventById = async (id: number): Promise<Event> => {
  const result = await pool.query<Event>('SELECT * FROM events WHERE id = $1', [
    id,
  ]);
  if (!result.rows[0]) {
    throw new NotFoundError();
  }
  return result.rows[0];
};

export const findEventByUuid = async (uuid: string): Promise<Event> => {
  if (!uuidValidate(uuid)) {
    throw new Error('Invalid UUID format');
  }
  const result = await pool.query<Event>('SELECT * FROM events WHERE id = $1', [
    uuid,
  ]);
  if (!result.rows[0]) {
    throw new NotFoundError();
  }
  return result.rows[0];
};

export const addUserToEvent = async (
  eventId: number,
  userId: number,
  role: string = 'participant'
): Promise<EventUser> => {
  // First check if the event exists
  await findEventById(eventId);

  // Check if user is already associated with the event
  const existingResult = await pool.query<EventUser>(
    'SELECT * FROM events_users WHERE event_id = $1 AND user_id = $2',
    [eventId, userId]
  );

  if (existingResult.rows[0]) {
    // Update the role if it's different
    if (existingResult.rows[0].role !== role) {
      await pool.query('UPDATE events_users SET role = $1 WHERE id = $2', [
        role,
        existingResult.rows[0].id,
      ]);
    }
    return existingResult.rows[0];
  }

  // Create new association
  const result = await pool.query<EventUser>(
    `INSERT INTO events_users (event_id, user_id, role)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [eventId, userId, role]
  );

  return result.rows[0];
};
