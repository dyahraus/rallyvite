DROP TABLE IF EXISTS event_location_options CASCADE;

CREATE TABLE event_location_options (
  id SERIAL PRIMARY KEY,
  event_date_id INT NOT NULL,
  place_id INT,
  name VARCHAR(200),
  votes_count INT DEFAULT 0,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_date_id) REFERENCES event_dates(id) ON DELETE CASCADE,
  FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE SET NULL
);
