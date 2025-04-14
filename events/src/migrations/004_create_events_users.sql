-- Drop table if it exists
DROP TABLE IF EXISTS events_users CASCADE;

-- Create events_users table (tracks user participation in events)
CREATE TABLE events_users (
  event_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  status SMALLINT DEFAULT 1,
  role VARCHAR(20),
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (event_id, user_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
