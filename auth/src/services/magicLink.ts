import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import knex from '../config/database';
import crypto from 'crypto';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendMagicLink = async (email: string, token: string) => {
  const magicLink = `${process.env.APP_URL}/api/auth/magic-login?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Your Magic Login Link',
    text: `Click the link below to sign in:\n\n${magicLink}\n\nThis link expires in 10 minutes.`,
  };

  return transporter.sendMail(mailOptions);
};

export const createMagicLink = async (email: string) => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

  await knex('magic_links').insert({ email, token, expires_at: expiresAt });

  return token;
};

export const getMagicLink = async (token: string) => {
  return await knex('magic_links')
    .where({ token, used: false })
    .andWhere('expires_at', '>', new Date())
    .first();
};

export const markMagicLinkAsUsed = async (token: string) => {
  await knex('magic_links').where({ token }).update({ used: true });
};

export const requestMagicLink = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const token = await createMagicLink(email);
    await sendMagicLink(email, token);

    res.json({ message: 'Magic link sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Error generating magic link.' });
  }
};

export const magicLogin = async (req: Request, res: Response) => {
  const { token } = req.query;

  try {
    const magicLink = await getMagicLink(token as string);
    if (!magicLink) {
      return res
        .status(401)
        .json({ message: 'Invalid or expired magic link.' });
    }

    await markMagicLinkAsUsed(token as string);

    // Generate JWT
    const jwtToken = jwt.sign(
      { email: magicLink.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    res.json({ token: jwtToken });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in with magic link.' });
  }
};
