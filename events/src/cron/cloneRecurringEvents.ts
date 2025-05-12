import dayjs from 'dayjs';
import pool from '../config/db';
import { v4 as uuidv4 } from 'uuid';

export const cloneRecurringEvents = async () => {
  const today = dayjs().startOf('day').toDate();

  // Step 1: Find past recurring events whose latest date has passed
  const result = await pool.query(
    `
    SELECT e.*, MAX(ed.date) as last_event_date
    FROM events e
    JOIN event_dates ed ON ed.event_id = e.id
    WHERE e.is_recurring = true
    GROUP BY e.id
    HAVING MAX(ed.date) < $1
  `,
    [today]
  );

  for (const event of result.rows) {
    const repeatWeeks = event.repeat_interval_weeks || 2;
    const newUuid = uuidv4(); // custom function or uuid.v4()

    // Step 2: Clone event
    const { rows: newEventRows } = await pool.query(
      `
      INSERT INTO events (uuid, name, description, duration, frequency, activity_id, is_recurring, repeat_interval_weeks)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `,
      [
        newUuid,
        event.name,
        event.description,
        event.duration,
        event.frequency,
        event.activity_id,
        true,
        repeatWeeks,
      ]
    );

    const newEventId = newEventRows[0].id;

    // Step 3: Clone dates (shifted forward by repeat interval)
    const { rows: oldDates } = await pool.query(
      `
      SELECT * FROM event_dates WHERE event_id = $1
    `,
      [event.id]
    );

    for (const date of oldDates) {
      const newDate = dayjs(date.date)
        .add(repeatWeeks, 'week')
        .format('YYYY-MM-DD');
      await pool.query(
        `
        INSERT INTO event_dates (event_id, location_id, date)
        VALUES ($1, $2, $3)
      `,
        [newEventId, date.location_id, newDate]
      );
    }

    console.log(
      `Cloned recurring event ${event.id} to new event ${newEventId}`
    );
  }
};
