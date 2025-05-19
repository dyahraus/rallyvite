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
  role: string = 'participant',
  response: string = 'yes'
): Promise<EventUser> => {
  const event = await findEventById(eventId);

  const existingResult = await pool.query<EventUser>(
    'SELECT * FROM events_users WHERE event_id = $1 AND user_id = $2',
    [eventId, userId]
  );

  if (existingResult.rows[0]) {
    await pool.query(
      `UPDATE events_users 
       SET role = $1, response = $2, rsvp_status = TRUE, last_modified = NOW()
       WHERE event_id = $3 AND user_id = $4`,
      [role, response, eventId, userId]
    );
    return { ...existingResult.rows[0], response };
  }

  const result = await pool.query<EventUser>(
    `INSERT INTO events_users (event_id, user_id, role, response, rsvp_status)
     VALUES ($1, $2, $3, $4, TRUE)
     RETURNING *`,
    [eventId, userId, role, response]
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

interface EventTimeRow {
  event_time_id: number;
  time: string;
  event_date_id: number;
  date: string;
  location_id: number;
  location_name: string;
}

interface TimeBlock {
  eventDateId: number;
  locationId: number;
  locationName: string;
  date: string;
  timeIds: number[];
  startTime: string;
  endTime: string;
  yesCount?: number;
}

function parseDuration(durationStr: string): number {
  const match = durationStr.match(/(?:(\d+)h)?\s*(?:(\d+)m)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  return hours * 60 + minutes;
}

function addMinutes(timeStr: string, minutes: number): string {
  const date = new Date(`1970-01-01T${timeStr}Z`);
  date.setUTCMinutes(date.getUTCMinutes() + minutes);
  return date.toISOString().split('T')[1].slice(0, 8); // returns "HH:mm:ss"
}

function buildValidTimeBlocks(
  times: EventTimeRow[],
  slotCount: number
): TimeBlock[] {
  const blocks: TimeBlock[] = [];
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
          locationName: block[0].location_name,
          date: block[0].date,
          timeIds: block.map((b) => b.event_time_id),
          startTime: block[0].time,
          endTime: addMinutes(block[block.length - 1].time, 15),
        });
      }
    }
  }

  return blocks;
}

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
      ed.location_id,
      l.name AS location_name
    FROM event_times et
    JOIN event_dates ed ON et.event_date_id = ed.id
    JOIN locations l ON ed.location_id = l.id
    WHERE ed.event_id = $1
    ORDER BY ed.date, ed.location_id, et.time ASC
  `,
    [eventId]
  );

  const blocks = buildValidTimeBlocks(rows, slotCount);

  const ranked = await Promise.all(
    blocks.map(async (block) => {
      const { timeIds } = block;

      // Step 1: Get RSVP responses for the event
      const {
        rows: rsvpRows,
      }: QueryResult<{ user_id: number; response: string }> = await pool.query(
        `SELECT user_id, response
         FROM events_users
         WHERE event_id = $1`,
        [eventId]
      );

      // Step 2: Get user selections for this block
      const {
        rows: selectionRows,
      }: QueryResult<{ user_id: number; event_time_id: number }> =
        await pool.query(
          `SELECT user_id, event_time_id
         FROM user_event_times
         WHERE event_time_id = ANY($1::int[])`,
          [timeIds]
        );

      // Step 3: Build a map of user_id -> selected time_ids
      const selectionMap = new Map<number, Set<number>>();
      for (const row of selectionRows) {
        if (!selectionMap.has(row.user_id)) {
          selectionMap.set(row.user_id, new Set());
        }
        selectionMap.get(row.user_id)!.add(row.event_time_id);
      }

      // Step 4: Build participant list
      const participants = rsvpRows
        .filter(({ response }) => response === 'yes' || response === 'maybe')
        .map(({ user_id, response }) => {
          const selected = selectionMap.get(user_id);

          const hasAllTimeIds =
            selected && timeIds.every((id) => selected.has(id));

          if (hasAllTimeIds) {
            return { userId: user_id, response };
          }

          return null; // exclude if missing any slot
        })
        .filter(Boolean); // remove nulls

      const yesCount = participants.filter((p) => p?.response === 'yes').length;

      return {
        ...block,
        yesCount,
        participants,
      };
    })
  );

  ranked.sort((a, b) => (b.yesCount ?? 0) - (a.yesCount ?? 0));
  return ranked;
};
