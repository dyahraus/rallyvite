import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import pool from '../config/db';
dayjs.extend(utc);

export const markCompletedEvents = async () => {
  const todayUtc = dayjs.utc().startOf('day').toDate();

  await pool.query(
    `
    UPDATE events
    SET status = 3,
        date_completed = NOW()
    WHERE status = 2
      AND id IN (
        SELECT e.id
        FROM events e
        JOIN event_dates ed ON ed.event_id = e.id
        GROUP BY e.id
        HAVING MAX(ed.date) < $1
      )
  `,
    [todayUtc]
  );

  console.log('[CRON] Events marked as completed');
};
