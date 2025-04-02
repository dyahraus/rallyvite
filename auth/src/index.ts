import { app } from './app';
import { pool } from './config/db';
import { runMigrations } from './config/initDb';

const start = async () => {
  if (!process.env.PG_USER) throw new Error('PG_USER must be defined');
  if (!process.env.PG_HOST) throw new Error('PG_HOST must be defined');
  if (!process.env.PG_DATABASE) throw new Error('PG_DATABASE must be defined');
  if (!process.env.PG_PASSWORD) throw new Error('PG_PASSWORD must be defined');
  if (!process.env.PG_PORT) throw new Error('PG_PORT must be defined');
  if (!process.env.SENDGRID_API_KEY)
    throw new Error('SENDGRID_API_KEY must be defined');
  if (!process.env.SENDER_EMAIL)
    throw new Error('SENDER_EMAIL must be defined');
  if (!process.env.FRONTEND_URL)
    throw new Error('FRONTEND_URL must be defined');
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');

  console.log('PG_USER:', process.env.PG_USER);
  console.log('PG_HOST:', process.env.PG_HOST);
  console.log('PG_DATABASE:', process.env.PG_DATABASE);
  console.log('PG_PASSWORD:', process.env.PG_PASSWORD);
  console.log('PG_PORT:', process.env.PG_PORT);
  console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY);
  console.log('SENDER_EMAIL:', process.env.SENDER_EMAIL);
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
  console.log('JWT_KEY:', process.env.JWT_KEY);

  try {
    await runMigrations();
    console.log('Database initialized');
  } catch {
    throw new Error('Database failed');
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!');
  });
};

start();

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await pool.end(); // Close the pool when the app is shutting down
  process.exit(0); // Exit the process
});

process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  await pool.end(); // Close the pool when the app is shutting down
  process.exit(0); // Exit the process
});
