import { Kafka } from 'kafkajs';
import { pool } from './db';

const kafka = new Kafka({
  clientId: 'chat-service',
  brokers: ['kafka-controller.default.svc.cluster.local:9092'], // ✅ use correct DNS
});

export const consumer = kafka.consumer({
  groupId: 'chat-group',
});

export const connectConsumer = async () => {
  try {
    await consumer.connect();
    console.log('✅ Kafka consumer connected');

    await consumer.subscribe({ topic: 'user-created', fromBeginning: true });
    console.log('📥 Subscribed to "user-created" topic');

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          if (topic === 'user-created' && message.value) {
            const userData = JSON.parse(message.value.toString());

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

            console.log(`✅ Synced user to events DB: ${userData.id}`);
          }
        } catch (err) {
          console.error('❌ Error processing Kafka message:', err);
        }
      },
    });
  } catch (err) {
    console.error('❌ Kafka consumer failed to connect or subscribe:', err);
  }
};

export const disconnectConsumer = async () => {
  try {
    await consumer.disconnect();
    console.log('🛑 Kafka consumer disconnected');
  } catch (err) {
    console.error('⚠️ Error disconnecting Kafka consumer:', err);
  }
};
