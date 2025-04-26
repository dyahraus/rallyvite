-- Drop table if it exists
DROP TABLE IF EXISTS invites CASCADE;

-- Create invites table
CREATE TABLE invites (
  id SERIAL PRIMARY KEY,
  event_uuid UUID NOT NULL REFERENCES events(uuid) ON DELETE CASCADE,
  invited_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  token UUID NOT NULL UNIQUE,
  status SMALLINT DEFAULT 1, -- 1 = unopened, 2 = opened, 3 = joined
  joined_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a trigger function to update last_modified on update
CREATE OR REPLACE FUNCTION update_last_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_modified = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to the invites table
CREATE TRIGGER trigger_update_last_modified_invites
BEFORE UPDATE ON invites
FOR EACH ROW
EXECUTE FUNCTION update_last_modified_column();
