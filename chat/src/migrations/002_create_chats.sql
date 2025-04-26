-- Drop table if it exists
DROP TABLE IF EXISTS messages CASCADE;

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  uuid UUID NOT NULL UNIQUE,
  event_uuid UUID NOT NULL REFERENCES events(uuid),
  user_uuid UUID NOT NULL REFERENCES users(uuid),
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_messages_event_uuid ON messages (event_uuid);
