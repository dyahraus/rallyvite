import dotenv from 'dotenv';

dotenv.config(); // Load .env variables into process.env

if (
  !process.env.PG_USER ||
  !process.env.PG_PASSWORD ||
  !process.env.PG_DATABASE
) {
  throw new Error('Missing required database environment variables!');
}

export const DB_CONFIG = {
  user: process.env.PG_USER!,
  password: process.env.PG_PASSWORD!,
  host: process.env.PG_HOST || 'localhost',
  port: Number(process.env.PG_PORT) || 5432,
  database: process.env.PG_DATABASE!,
};
