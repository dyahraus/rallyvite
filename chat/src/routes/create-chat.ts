import express, { Request, Response } from 'express';
import { currentUser } from '../middlewares/current-user';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { createMessage } from '../services/chatService';
import { Chat } from '../models/chat';

const router = express.Router();

router.post('/api/chats/create', async (req: Request, res: Response) => {
  console.log('Received create chat message request');
  const { event_uuid, content, image_url } = req.body;
  console.log('Request body:', { event_uuid, content, image_url });

  if (!req.currentUser) {
    console.log('No authenticated user found');
    throw new NotAuthorizedError();
  }

  if (!event_uuid) {
    console.log('Invalid event_uuid provided');
    res.status(400).send({ error: 'Event UUID is required.' });
    return;
  }

  if (!content && !image_url) {
    console.log('No content or image provided');
    res.status(400).send({ error: 'Either content or image_url is required.' });
    return;
  }

  try {
    console.log('Creating new chat message');
    console.log('Event UUID:', event_uuid);
    console.log('User UUID:', req.currentUser.uuid);
    console.log('Content:', content);
    console.log('Image URL:', image_url);

    const newMessage = await createMessage({
      event_uuid: event_uuid,
      user_uuid: req.currentUser.uuid,
      content: content?.trim() || null,
      image_url: image_url?.trim() || null,
    });

    console.log('Chat message created successfully:', newMessage);
    res.status(201).send(newMessage);
  } catch (err) {
    console.error('Error creating chat message:', err);
    res.status(500).send({ error: 'Error creating chat message' });
  }
});

export { router as createChatRouter };
