import pool from '../config/db';
import { EventUser } from '../models/eventUser';
import { User } from '../models/user';

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
  const result = await pool.query<User>(
    `SELECT u.uuid, u.name, u.email, u.phone, u.is_guest, u.profile_picture_url
     FROM events_users eu
     JOIN users u ON eu.user_id = u.id
     WHERE eu.event_id = $1`,
    [eventId]
  );
  return result.rows;
};
