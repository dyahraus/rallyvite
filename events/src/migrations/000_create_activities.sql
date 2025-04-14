-- Drop table if it exists
DROP TABLE IF EXISTS activities CASCADE;

-- Create activities table
CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  uuid UUID NOT NULL UNIQUE,
  status SMALLINT DEFAULT 1,
  type VARCHAR(20),
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500),
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
