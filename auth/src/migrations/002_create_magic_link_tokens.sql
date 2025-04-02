DROP TABLE IF EXISTS "magic_link_tokens" CASCADE;
CREATE TABLE magic_link_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  token UUID NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false
);

