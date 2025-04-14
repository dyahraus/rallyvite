import { Kafka } from 'kafkajs';
import { pool } from './db';

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [process.env.KAFKA_BROKERS!],
});

export const consumer = kafka.consumer({
  groupId: process.env.KAFKA_GROUP_ID!,
});

export const connectConsumer = async () => {
  await consumer.connect();
  console.log('Kafka consumer connected');

  await consumer.subscribe({ topic: 'user-created', fromBeginning: true });
  console.log('Subscribed to user-created topic');

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (topic === 'user-created' && message.value) {
        const userData = JSON.parse(message.value.toString());

        // Insert user into events service database
        await pool.query(
          `INSERT INTO users (id, uuid, name, email, phone, is_guest, date_created)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO NOTHING`,
          [
            userData.id,
            userData.uuid,
            userData.name,
            userData.email,
            userData.phone,
            userData.is_guest,
            userData.date_created,
          ]
        );

        console.log('User synced to events service:', userData.id);
      }
    },
  });
};

export const disconnectConsumer = async () => {
  await consumer.disconnect();
  console.log('Kafka consumer disconnected');
};
