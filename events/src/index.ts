import { app } from './app';
import { runMigrations } from './config/initDb';
import { pool } from './config/db';

const start = async () => {
  if (!process.env.PG_USER) throw new Error('PG_USER must be defined');
  if (!process.env.PG_HOST) throw new Error('PG_HOST must be defined');
  if (!process.env.PG_DATABASE) throw new Error('PG_DATABASE must be defined');
  if (!process.env.PG_PASSWORD) throw new Error('PG_PASSWORD must be defined');
  if (!process.env.PG_PORT) throw new Error('PG_PORT must be defined');
  try {
    await runMigrations();
    console.log('Database initialized');
  } catch {
    throw new Error('Database failed');
  }

  app.listen(5000, () => {
    console.log('Listening on port 5000!!!!');
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
