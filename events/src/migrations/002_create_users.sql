-- Drop table if it exists
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  uuid UUID NOT NULL UNIQUE,                        -- same UUID from auth
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  last_synced TIMESTAMP DEFAULT NOW()
);
