DROP TABLE IF EXISTS event_dates_users CASCADE;

CREATE TABLE event_dates_users (
  event_date_id INT NOT NULL,
  user_id UUID NOT NULL,
  status SMALLINT DEFAULT 1,
  type VARCHAR(20),
  roles_json JSONB,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (event_date_id, user_id),
  FOREIGN KEY (event_date_id) REFERENCES event_dates(id) ON DELETE CASCADE
);
