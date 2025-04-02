import express, { Request, Response } from 'express';
import {
  createUser,
  getUserByEmail,
  getUserByPhone,
  normalizePhoneNumber,
} from '../services/userService';
import pool from '../config/db';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import jwt from 'jsonwebtoken';
import { createSession } from '../services/sessionService';
import { createMagicLinkToken } from '../services/magicLinkService';

const router = express.Router();

router.post('/api/users/createuser', async (req: Request, res: Response) => {
  try {
    const { email, phone, name } = req.body;

    if (!name) {
      throw new BadRequestError('Must have a name to be associated with user');
    }
    let normPhone;
    if (phone) {
      normPhone = normalizePhoneNumber(phone);
    }

    let user: User;

    if (email || normPhone) {
      if (email) {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
          throw new BadRequestError('User with that email already exists');
        }
      }

      if (normPhone) {
        const existingUser = await getUserByPhone(normPhone);
        if (existingUser) {
          throw new BadRequestError(
            'User with that phone number already exists'
          );
        }
      }

      user = await createUser({
        email,
        phone: normPhone ?? undefined,
        name,
        is_guest: false,
      });
    } else {
      user = await createUser({
        name,
        is_guest: true,
      });
    }

    console.log('User created with ID:', user.uuid);

    //  Create session in DB
    const session = await createSession(user.uuid, null, 'web');

    // Generate magic link token (optional for passwordless login later)
    let magicLinkToken = null;
    if (user.email || user.phone) {
      const magicLink = await createMagicLinkToken(user.uuid);
      magicLinkToken = magicLink.token;
    }

    // ✅ Create JWT including sessionToken
    const userJwt = jwt.sign(
      {
        id: user.uuid,
        email: user.email,
        is_guest: user.is_guest,
        sessionToken: session.session_token, // <-- include session token
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(201).send({
      userId: user.uuid,
      jwt: userJwt,
      sessionToken: session.session_token,
      magicLinkToken, // Optional: can omit in production
    });
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
});

export { router as createUserRouter };
