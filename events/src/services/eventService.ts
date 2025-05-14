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
  const result = await pool.query<Event>(
    'SELECT * FROM events WHERE uuid = $1',
    [uuid]
  );
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
  const event = await findEventById(eventId);

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

export const updateEventRepeatConfig = async (
  eventId: number,
  options: { is_recurring: boolean; repeat_interval_weeks: number }
) => {
  const result = await pool.query(
    `
    UPDATE events
    SET is_recurring = $1,
        repeat_interval_weeks = $2,
        last_modified = NOW()
    WHERE id = $3
    RETURNING *;
  `,
    [options.is_recurring, options.repeat_interval_weeks, eventId]
  );

  return result.rows[0];
};

import { QueryResult } from 'pg';

// Define the shape of a row returned by the SQL query
interface EventTimeRow {
  event_time_id: number;
  time: string; // "HH:mm:ss"
  event_date_id: number;
  date: string; // ISO string
  location_id: number;
}

// Block of continuous time slots
interface TimeBlock {
  eventDateId: number;
  locationId: number;
  timeIds: number[];
  startTime: string;
  endTime: string;
  yesCount?: number; // populated after ranking
}

// Parse "2h 15m" -> 135
function parseDuration(durationStr: string): number {
  const match = durationStr.match(/(?:(\d+)h)?\s*(?:(\d+)m)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  return hours * 60 + minutes;
}

// Extract valid continuous time blocks by date/location
function buildValidTimeBlocks(
  times: EventTimeRow[],
  slotCount: number
): TimeBlock[] {
  const blocks: TimeBlock[] = [];

  // Group by date + location
  const grouped: Record<string, EventTimeRow[]> = {};
  for (const row of times) {
    const key = `${row.event_date_id}-${row.location_id}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(row);
  }

  for (const rows of Object.values(grouped)) {
    const sortedRows = rows.sort((a, b) => a.time.localeCompare(b.time));

    for (let i = 0; i <= sortedRows.length - slotCount; i++) {
      const block = sortedRows.slice(i, i + slotCount);

      let isValid = true;
      for (let j = 1; j < block.length; j++) {
        const prev = block[j - 1].time;
        const curr = block[j].time;
        const diff =
          (new Date(`1970-01-01T${curr}Z`).getTime() -
            new Date(`1970-01-01T${prev}Z`).getTime()) /
          (1000 * 60);
        if (diff !== 15) {
          isValid = false;
          break;
        }
      }

      if (isValid) {
        blocks.push({
          eventDateId: block[0].event_date_id,
          locationId: block[0].location_id,
          timeIds: block.map((b) => b.event_time_id),
          startTime: block[0].time,
          endTime: block[block.length - 1].time,
        });
      }
    }
  }

  return blocks;
}

// Main function to fetch and rank available blocks
export const getEventOptions = async (
  eventId: number,
  durationStr: any
): Promise<TimeBlock[]> => {
  const durationMin = parseDuration(durationStr);
  const slotCount = durationMin / 15;

  const { rows }: QueryResult<EventTimeRow> = await pool.query(
    `
    SELECT
      et.id AS event_time_id,
      et.time,
      et.event_date_id,
      ed.date,
      ed.location_id
    FROM event_times et
    JOIN event_dates ed ON et.event_date_id = ed.id
    WHERE ed.event_id = $1
    ORDER BY ed.date, ed.location_id, et.time ASC
  `,
    [eventId]
  );

  const blocks = buildValidTimeBlocks(rows, slotCount);

  const ranked = await Promise.all(
    blocks.map(async (block) => {
      const { rows: users }: QueryResult<{ user_id: number }> =
        await pool.query(
          `
        SELECT user_id
        FROM user_event_times
        WHERE event_time_id = ANY($1::int[])
        GROUP BY user_id
        HAVING COUNT(*) = $2
      `,
          [block.timeIds, block.timeIds.length]
        );

      return { ...block, yesCount: users.length };
    })
  );

  ranked.sort((a, b) => (b.yesCount ?? 0) - (a.yesCount ?? 0));
  return ranked;
};
