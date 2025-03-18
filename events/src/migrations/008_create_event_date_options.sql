DROP TABLE IF EXISTS event_date_options CASCADE;

CREATE TABLE event_date_options (
  id SERIAL PRIMARY KEY,
  event_date_id INT NOT NULL,
  place_id INT,
  date_start TIMESTAMP,
  times_json JSONB,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_date_id) REFERENCES event_dates(id) ON DELETE CASCADE,
  FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE SET NULL
);
