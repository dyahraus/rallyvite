import express from 'express';
// import 'express-async-errors';
// import { json } from 'body-parser';

// import cookieSession from 'cookie-session';

import { createUserRouter } from './routes/create-user';

const app = express();
// app.set('trust proxy', true); // traffic is being proxied through ingress inginx express is aware of the proxy and trust traffic
// app.use(json());
// app.use(
//   cookieSession({
//     signed: false, // not encrypted
//     secure: process.env.NODE_ENV !== 'test', // only used if user is visiting over https connection
//   })
// );

// app.all('*', () => {
//   throw new NotFoundError(); // express will capture this and send it off to the errorHandler middleware
// });

// app.use(errorHandler);

app.use(createUserRouter);

export { app };
