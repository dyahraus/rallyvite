-- Drop table if it exists
DROP TABLE IF EXISTS activities CASCADE;

-- Create activities table
CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  status SMALLINT DEFAULT 1,
  type VARCHAR(20),
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500),
  place_type VARCHAR(30),
  place_keywords VARCHAR(200),
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
