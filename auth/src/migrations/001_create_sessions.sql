-- Drop table if it exists
DROP TABLE IF EXISTS sessions CASCADE;

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(uuid),
  session_token UUID NOT NULL UNIQUE,
  device_id VARCHAR(64),
  session_type VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  invalidated BOOLEAN DEFAULT false
);