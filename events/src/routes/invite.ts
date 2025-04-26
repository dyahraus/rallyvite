import express, { Request, Response, RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post('/api/events/invite', (async (req: Request, res: Response) => {
  const { eventUuid } = req.body;
  const userId = req.currentUser?.id;

  if (!eventUuid || typeof eventUuid !== 'string') {
    throw new BadRequestError('Invalid or missing eventUuid');
  }

  if (!userId) {
    throw new BadRequestError('User not authenticated');
  }

  try {
    const token = uuidv4();

    const result = await pool.query(
      `INSERT INTO invites (event_uuid, invited_by_user_id, token)
       VALUES ($1, $2, $3)
       RETURNING id, token`,
      [eventUuid, userId, token]
    );

    const inviteToken = result.rows[0].token;
    const inviteUrl = `event/${eventUuid}?invite=${inviteToken}`;

    res.status(201).json({ url: inviteUrl });
  } catch (error) {
    console.error('Failed to create invite:', error);
    throw new BadRequestError('Failed to create invite');
  }
}) as RequestHandler);

export { router as inviteRouter };
