-- Drop table if it exists
DROP TABLE IF EXISTS locations CASCADE;

-- Create locations table
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  uuid UUID NOT NULL UNIQUE,
  type VARCHAR(20),
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500),
  address VARCHAR(255) DEFAULT '',
  city VARCHAR(255) DEFAULT '',
  state VARCHAR(255) DEFAULT '',
  zip VARCHAR(255) DEFAULT '',
  country VARCHAR(255) DEFAULT '',
  latitude DECIMAL(12,6) DEFAULT NULL,
  longitude DECIMAL(12,6) DEFAULT NULL,
  google_place_id VARCHAR(200),
  source VARCHAR(100),
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);