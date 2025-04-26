import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler } from './middlewares/error-handler';
import cookieSession from 'cookie-session';
import { createUserRouter } from './routes/create-user';
import { currentUserRouter } from './routes/current-user';
import { NotFoundError } from './errors/not-found-error';
import { loginUserRouter } from './routes/login-user';
import { editUserRouter } from './routes/edit-user';

console.log(process.env.SENDGRID_API_KEY);
const app = express();
app.set('trust proxy', true); // traffic is being proxied through ingress inginx express is aware of the proxy and trust traffic
app.use(json());
app.use(
  cookieSession({
    signed: false, // not encrypted
    // secure: process.env.NODE_ENV !== 'test', // only used if user is visiting over https connection
  })
);

app.use(createUserRouter);
app.use(currentUserRouter);
app.use(loginUserRouter);
app.use(editUserRouter);

app.all('*', () => {
  throw new NotFoundError(); // express will capture this and send it off to the errorHandler middleware
});

export { app };
