DROP TABLE IF EXISTS event_location_options_users CASCADE;

CREATE TABLE event_location_options_users (
  event_location_option_id INT NOT NULL,
  user_id UUID NOT NULL,
  status SMALLINT DEFAULT 1,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (event_location_option_id, user_id),
  FOREIGN KEY (event_location_option_id) REFERENCES event_location_options(id) ON DELETE CASCADE
);
