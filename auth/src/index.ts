import { app } from './app';
import dotenv from 'dotenv';

const start = async () => {
  dotenv.config();

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
  // // check to make sure enviornment variable is defined
  // if (!process.env.JWT_KEY) {
  //   throw new Error('JWT_KEY must be defined')
  // }
  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!');
  });
};

start();
