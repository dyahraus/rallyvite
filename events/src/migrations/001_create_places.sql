-- Drop table if it exists
DROP TABLE IF EXISTS places CASCADE;

-- Create places table
CREATE TABLE places (
  id SERIAL PRIMARY KEY,
  status SMALLINT DEFAULT 1,
  type VARCHAR(20),
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500),
  address1 VARCHAR(255) DEFAULT '',
  address2 VARCHAR(255) DEFAULT '',
  city VARCHAR(255) DEFAULT '',
  state VARCHAR(255) DEFAULT '',
  zip VARCHAR(255) DEFAULT '',
  country VARCHAR(255) DEFAULT '',
  latitude DECIMAL(12,6) DEFAULT NULL,
  longitude DECIMAL(12,6) DEFAULT NULL,
  google_place_id VARCHAR(200),
  website_url VARCHAR(255),
  page_content TEXT,
  rating VARCHAR(10),
  ratings_count INT DEFAULT 0, -- Removed UNSIGNED
  business_hours_json JSONB,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
