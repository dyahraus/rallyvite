import pool from '../config/db';
import { Session } from '../models/session';
import { v4 as uuidv4 } from 'uuid';

export const createSession = async (
  userId: string,
  deviceId: string | null,
  sessionType = 'web'
): Promise<Session> => {
  const sessionToken = uuidv4();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

  const result = await pool.query<Session>(
    `
    INSERT INTO sessions (user_id, session_token, device_id, session_type, expires_at)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `,
    [userId, sessionToken, deviceId, sessionType, expiresAt]
  );

  return result.rows[0];
};

export const getSessionByToken = async (
  sessionToken: string
): Promise<Session | null> => {
  const result = await pool.query<Session>(
    `
    SELECT * FROM sessions
    WHERE session_token = $1
    `,
    [sessionToken]
  );

  return result.rows[0] || null;
};
