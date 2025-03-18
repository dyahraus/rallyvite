DROP TABLE IF EXISTS activities_places CASCADE;

CREATE TABLE activities_places (
  activity_id INT NOT NULL,
  place_id INT NOT NULL,
  status SMALLINT DEFAULT 1,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (activity_id, place_id),
  FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
  FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE
);
