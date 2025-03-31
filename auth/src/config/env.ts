import dotenv from 'dotenv';
dotenv.config();

if (!process.env.PG_USER) throw new Error('PG_USER must be defined');
if (!process.env.PG_HOST) throw new Error('PG_HOST must be defined');
if (!process.env.PG_DATABASE) throw new Error('PG_DATABASE must be defined');
if (!process.env.PG_PASSWORD) throw new Error('PG_PASSWORD must be defined');
if (!process.env.PG_PORT) throw new Error('PG_PORT must be defined');
if (!process.env.SENDGRID_API_KEY)
  throw new Error('SENDGRID_API_KEY must be defined');
if (!process.env.SENDER_EMAIL) throw new Error('SENDER_EMAIL must be defined');
if (!process.env.FRONTEND_URL) throw new Error('FRONTEND_URL must be defined');
if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');

export const env = {
  pgUser: process.env.PG_USER,
  pgHost: process.env.PG_HOST,
  pgDatabase: process.env.PG_DATABASE,
  pgPassword: process.env.PG_PASSWORD,
  pgPort: parseInt(process.env.PG_PORT, 10),
  sendGridApiKey: process.env.SENDGRID_API_KEY,
  senderEmail: process.env.SENDER_EMAIL,
  frontendUrl: process.env.FRONTEND_URL,
  jwtKey: process.env.JWT_KEY,
};
