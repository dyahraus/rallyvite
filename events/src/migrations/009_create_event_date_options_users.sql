DROP TABLE IF EXISTS event_date_options_users CASCADE;

CREATE TABLE event_date_options_users (
  event_date_option_id INT NOT NULL,
  user_id UUID NOT NULL,
  status SMALLINT DEFAULT 1,
  times_json JSONB,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (event_date_option_id, user_id),
  FOREIGN KEY (event_date_option_id) REFERENCES event_date_options(id) ON DELETE CASCADE
);
