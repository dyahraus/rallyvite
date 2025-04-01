import { app } from './app';

const start = async () => {
  // check to make sure enviornment variable is defined
  // if (!process.env.JWT_KEY) {
  //   throw new Error('JWT_KEY must be defined');
  // }
  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();
