import pool from '../config/db';
import { EventUser } from '../models/eventUser';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';

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

export const addUserEventTimes = async (
  userId: number,
  event: any // ideally you'd type this strictly
): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const timeIds: number[] = [];

    for (const location of event.locations || []) {
      for (const date of location.dates || []) {
        for (const eventTimeId of date.userSelectedTimes || []) {
          timeIds.push(eventTimeId);
        }
      }
    }

    if (timeIds.length === 0) {
      throw new BadRequestError(
        'No user-selected times found in event payload'
      );
    }

    const insertPromises = timeIds.map((timeId) => {
      return client.query(
        `
        INSERT INTO user_event_times (user_id, event_time_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, event_time_id) DO NOTHING
      `,
        [userId, timeId]
      );
    });

    await Promise.all(insertPromises);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error inserting user_event_times:', err);
    throw new BadRequestError('Failed to insert user event times');
  } finally {
    client.release();
  }
};
