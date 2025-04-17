import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'auth-service',
  brokers: ['kafka-controller.default.svc.cluster.local:9092'],
});

export const producer = kafka.producer();

export const bootstrapKafka = async () => {
  const admin = kafka.admin();
  await admin.connect();

  try {
    const cluster = await admin.describeCluster();
    console.log('🧠 Kafka Cluster Info:', cluster);

    const topicCreated = await admin.createTopics({
      topics: [
        { topic: 'user-created', numPartitions: 1, replicationFactor: 1 },
      ],
      waitForLeaders: true,
    });

    console.log(topicCreated ? '✅ Topic created' : '⚠️ Topic already exists');

    await new Promise((r) => setTimeout(r, 3000));

    const metadata = await admin.fetchTopicMetadata({
      topics: ['user-created'],
    });
    console.log('✅ Topic metadata:', metadata);
  } catch (err) {
    console.error('[Kafka Bootstrap Error]', err);
  } finally {
    await admin.disconnect();
  }

  await producer.connect();
  console.log('✅ Kafka producer connected');
};

export const disconnectProducer = async () => {
  await producer.disconnect();
  console.log('🛑 Kafka producer disconnected');
};
