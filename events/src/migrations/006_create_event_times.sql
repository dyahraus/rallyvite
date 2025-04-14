-- Drop table if it exists
DROP TABLE IF EXISTS event_times CASCADE;

CREATE TABLE event_times (
  id SERIAL PRIMARY KEY,
  event_date_id INTEGER NOT NULL REFERENCES event_dates(id) ON DELETE CASCADE,
  time TIME NOT NULL,

  UNIQUE (event_date_id, time)
);
