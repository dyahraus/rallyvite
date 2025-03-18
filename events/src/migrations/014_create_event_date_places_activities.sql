DROP TABLE IF EXISTS event_date_places_activities CASCADE;

CREATE TABLE event_date_places_activities (
  activity_id INT NOT NULL,
  event_date_place_id INT NOT NULL,
  status SMALLINT DEFAULT 1,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (activity_id, event_date_place_id),
  FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
  FOREIGN KEY (event_date_place_id) REFERENCES event_date_places(id) ON DELETE CASCADE
);
