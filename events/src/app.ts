import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
// import cookieSession from 'cookie-session';
// // import { currentUserRouter } from './routes/current-user';
// import {
//   currentUser,
//   errorHandler,
//   NotFoundError,
// } from '../../common/src/index';

const app = express();

// app.use(currentUser);

// app.all('*', () => {
//   throw new NotFoundError(); // express will capture this and send it off to the errorHandler middleware
// });

// app.use(errorHandler);

export { app };
