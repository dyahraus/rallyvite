import express, { Request, Response, RequestHandler } from 'express';
import {
  getUserByEmail,
  getUserByPhone,
  normalizePhoneNumber,
} from '../services/userService';
import { createSession } from '../services/sessionService';
import { createMagicLinkToken } from '../services/magicLinkService';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/login', (async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      res.status(400).send({
        error: 'Email or phone number is required',
        code: 'MISSING_CREDENTIALS',
      });
      return;
    }

    let user = null;

    if (email) {
      user = await getUserByEmail(email);
    } else if (phone) {
      const normPhone = normalizePhoneNumber(phone);
      if (!normPhone) {
        res.status(400).send({
          error: 'Invalid phone number format',
          code: 'INVALID_PHONE',
        });
        return;
      }
      user = await getUserByPhone(normPhone);
    }

    if (!user) {
      res.status(404).send({
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      });
      return;
    }

    // Create session
    const session = await createSession(user.id, null, 'web');

    // Generate magic link token if needed
    let magicLinkToken = null;
    if (user.email || user.phone) {
      const magicLink = await createMagicLinkToken(user.id);
      magicLinkToken = magicLink.token;
    }

    // Create JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        is_guest: user.is_guest,
        sessionToken: session.session_token,
      },
      process.env.JWT_KEY!
    );

    // Set session cookie
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send({
      user: {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        is_guest: user.is_guest,
      },
      jwt: userJwt,
      sessionToken: session.session_token,
      magicLinkToken,
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send({
      error: 'An unexpected error occurred during login',
      code: 'LOGIN_ERROR',
    });
  }
}) as unknown as RequestHandler);

export { router as loginUserRouter };
