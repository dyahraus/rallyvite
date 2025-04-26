import express, { Request, Response } from 'express';
import pool from '../config/db';

const router = express.Router();

router.post('/api/invite/open', (async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({ error: 'Missing token' });
    return;
  }

  await pool.query(
    `UPDATE invites SET status = 2, last_modified = NOW() WHERE token = $1 AND status = 1`,
    [token]
  );

  res.status(204).end();
}) as express.RequestHandler);

export { router as openInviteRouter };
