import pool from '../config/db';
import { Event } from '../models/event';

export const createEvent = async (event: {
  name: string;
  description?: string;
}) => {
  const result = await pool.query<Event>(
    `INSERT INTO events (name, description, status)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [
      event.name,
      event.description ?? null,
      1, // default status
    ]
  );
  return result.rows[0];
};

export const getAllEvents = async () => {
  const result = await pool.query<Event>('SELECT * FROM events');
  return result.rows;
};
