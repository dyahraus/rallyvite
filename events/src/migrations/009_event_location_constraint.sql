-- Function
CREATE OR REPLACE FUNCTION enforce_event_location_fk()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM event_locations
    WHERE event_id = NEW.event_id AND location_id = NEW.location_id
  ) THEN
    RAISE EXCEPTION 'Invalid (event_id, location_id): not found in event_locations';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER check_event_location_exists
BEFORE INSERT OR UPDATE ON event_dates
FOR EACH ROW EXECUTE FUNCTION enforce_event_location_fk();
