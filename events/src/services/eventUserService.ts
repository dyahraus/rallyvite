import pool from '../config/db';
import { EventUser } from '../models/eventUser';

export const addUserToEvent = async (
  eventUser: Omit<EventUser, 'dateCreated'>
) => {
  const result = await pool.query<EventUser>(
    `INSERT INTO events_users (event_id, user_id, status, type, roles_json)
     VALUES ($1, $2, $3, $4, $5)`,
    [eventUser.event_id, eventUser.user_id, eventUser.role ?? null]
  );

  return result.rows[0];
};

export const getUsersForEvent = async (eventId: number) => {
  const result = await pool.query<EventUser>(
    `SELECT * FROM events_users WHERE event_id = $1`,
    [eventId]
  );
  return result.rows;
};
