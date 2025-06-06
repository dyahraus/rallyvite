-- Drop table if it exists
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  uuid UUID NOT NULL UNIQUE,
  name VARCHAR(50) DEFAULT '',
  nick_name VARCHAR(50),
  email VARCHAR(60) UNIQUE,
  phone VARCHAR(30),
  profile_picture_url TEXT,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_logon TIMESTAMP DEFAULT '1970-01-01 00:00:01',
  is_verified BOOLEAN DEFAULT false,
  status SMALLINT DEFAULT 1,
  is_guest BOOLEAN DEFAULT false
);
