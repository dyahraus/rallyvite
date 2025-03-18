-- Drop table if it exists
DROP TABLE IF EXISTS events_users CASCADE;

-- Create events_users table (tracks user participation in events)
CREATE TABLE events_users (
  event_id INT NOT NULL,
  user_id UUID NOT NULL, -- Store user ID without enforcing FK
  status SMALLINT DEFAULT 1,
  type VARCHAR(20),
  roles_json JSONB,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (event_id, user_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
