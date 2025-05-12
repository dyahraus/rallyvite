import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
// import { currentUserRouter } from './routes/current-user';
import { currentUser } from './middlewares/current-user';
import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middlewares/error-handler';
import { createEventRouter } from './routes/create-event';
import { appendOrganizerRouter } from './routes/append-organizer';
import { appendParticipantRouter } from './routes/append-participant';
import { findEventRouter } from './routes/find-event';
import { findUserEventsRouter } from './routes/find-user-events';
import { setRepeatIntervalRouter } from './routes/set-repeat-interval';

const app = express();

app.set('trust proxy', true); // traffic is being proxied through ingress inginx express is aware of the proxy and trust traffic
app.use(json());
app.use(
  cookieSession({
    signed: false, // not encrypted
    // secure: process.env.NODE_ENV !== 'test', // only used if user is visiting over https connection
  })
);

app.use(currentUser);

app.use(createEventRouter);
app.use(appendOrganizerRouter);
app.use(appendParticipantRouter);
app.use(setRepeatIntervalRouter);
app.use(findEventRouter);
app.use(findUserEventsRouter);

app.all('*', () => {
  throw new NotFoundError(); // express will capture this and send it off to the errorHandler middleware
});

export { app };
