-- Drop table if it exists
DROP TABLE IF EXISTS user_event_times CASCADE;

CREATE TABLE IF NOT EXISTS user_event_times (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_time_id INTEGER NOT NULL REFERENCES event_times(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'available', -- could be 'available', 'unavailable', 'preferred', etc.
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, event_time_id)
);