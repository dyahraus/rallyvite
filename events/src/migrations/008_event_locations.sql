-- Drop table if it exists
DROP TABLE IF EXISTS event_locations CASCADE;

CREATE TABLE event_locations (
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, location_id)
);
