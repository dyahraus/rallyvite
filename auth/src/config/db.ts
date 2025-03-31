import { Pool } from 'pg';
import { env } from './env'; // adjust the path if needed

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL auth database!');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

export default pool;
