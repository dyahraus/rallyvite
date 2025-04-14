DROP TABLE IF EXISTS activities_locations CASCADE;

CREATE TABLE activities_locations (
  activity_id INT NOT NULL,
  location_id INT NOT NULL,
  status SMALLINT DEFAULT 1,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (activity_id, location_id),
  FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);
