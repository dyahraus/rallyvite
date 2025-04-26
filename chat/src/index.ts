import { app } from './app';
import { runMigrations } from './config/initDb';
import { pool } from './config/db';
import { connectConsumer, disconnectConsumer } from './config/kafka';

const start = async () => {
  if (!process.env.PG_USER) throw new Error('PG_USER must be defined');
  if (!process.env.PG_HOST) throw new Error('PG_HOST must be defined');
  if (!process.env.PG_DATABASE) throw new Error('PG_DATABASE must be defined');
  if (!process.env.PG_PASSWORD) throw new Error('PG_PASSWORD must be defined');
  if (!process.env.PG_PORT) throw new Error('PG_PORT must be defined');
  if (!process.env.KAFKA_BROKERS)
    throw new Error('KAFKA_BROKERS must be defined');
  if (!process.env.KAFKA_CLIENT_ID)
    throw new Error('KAFKA_CLIENT_ID must be defined');
  if (!process.env.KAFKA_GROUP_ID)
    throw new Error('KAFKA_GROUP_ID must be defined');

  try {
    await runMigrations();
    console.log('Database initialized');
  } catch {
    throw new Error('Database failed');
  }

  // Connect to Kafka
  await connectConsumer();

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!');
  });
};

start();

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await disconnectConsumer();
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  await disconnectConsumer();
  await pool.end();
  process.exit(0);
});
