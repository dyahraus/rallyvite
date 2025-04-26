import express, { Request, Response } from 'express';
import { currentUser } from '../middlewares/current-user';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { getMessagesByEvent } from '../services/chatService';

const router = express.Router();

router.get(
  '/api/chats/event/:event_uuid',
  async (req: Request, res: Response) => {
    console.log('Received get messages by event request');
    const { event_uuid } = req.params;
    console.log('Event UUID:', event_uuid);

    if (!req.currentUser) {
      console.log('No authenticated user found');
      throw new NotAuthorizedError();
    }

    if (!event_uuid) {
      console.log('Invalid event_uuid provided');
      res.status(400).send({ error: 'Event UUID is required.' });
      return;
    }

    try {
      console.log('Retrieving messages for event:', event_uuid);
      const messages = await getMessagesByEvent(event_uuid);
      console.log(`Found ${messages.length} messages`);

      res.status(200).send(messages);
    } catch (err) {
      console.error('Error retrieving messages:', err);
      res.status(500).send({ error: 'Error retrieving messages' });
    }
  }
);

export { router as getChatsByEventRouter };
