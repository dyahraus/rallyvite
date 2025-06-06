-- Drop table if it exists
DROP TABLE IF EXISTS events CASCADE;

-- Create events table
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  uuid UUID NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
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

-- Attach trigger to the events table
CREATE TRIGGER trigger_update_last_modified
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION update_last_modified_column();
