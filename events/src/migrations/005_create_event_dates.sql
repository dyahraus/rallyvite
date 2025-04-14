-- Drop table if it exists
DROP TABLE IF EXISTS event_dates CASCADE;

-- Create event_dates table (tracks date options for events)
CREATE TABLE event_dates (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL,
  location_id INT NOT NULL,
  date DATE NOT NULL,
  status SMALLINT DEFAULT 1,  
  date_last_notification TIMESTAMP,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT fk_location FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL
);

-- Attach trigger to the event_dates table
CREATE TRIGGER trigger_update_last_modified
BEFORE UPDATE ON event_dates
FOR EACH ROW
EXECUTE FUNCTION update_last_modified_column();
