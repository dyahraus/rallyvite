import pool from '../config/db';
import { MagicLinkToken } from '../models/magicLinkToken';
import { v4 as uuidv4 } from 'uuid';
import sgMail from '@sendgrid/mail';

export const createMagicLinkToken = async (
  userId: number
): Promise<MagicLinkToken> => {
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

  const result = await pool.query<MagicLinkToken>(
    `
    INSERT INTO magic_link_tokens (user_id, token, expires_at)
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
    [userId, token, expiresAt]
  );

  return result.rows[0];
};

export const markMagicLinkAsUsed = async (token: string) => {
  await pool.query(
    `
    UPDATE magic_link_tokens
    SET used = true
    WHERE token = $1;
    `,
    [token]
  );
};

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendMagicLinkEmail = async (
  email: string,
  magicLinkUrl: string
) => {
  const msg = {
    to: email,
    from: process.env.SENDER_EMAIL!, // verified sender
    subject: 'Your Magic Login Link',
    text: `Click below to sign in:\n\n${magicLinkUrl}`,
    html: `<p>Click below to sign in:</p><p><a href="${magicLinkUrl}">Log in now</a></p>`,
  };

  await sgMail.send(msg);
};
