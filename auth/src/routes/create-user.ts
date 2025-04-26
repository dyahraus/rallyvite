import express, { Request, Response, RequestHandler } from 'express';
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
import { producer } from '../config/kafka';

const router = express.Router();

router.post('/api/users/createuser', (async (req: Request, res: Response) => {
  try {
    console.log('Starting user creation process...');
    const { email, phone, name } = req.body;
    console.log('Request body:', { email, phone, name });

    if (!name) {
      throw new BadRequestError('Must have a name to be associated with user');
    }
    let normPhone;
    if (phone) {
      normPhone = normalizePhoneNumber(phone);
      console.log('Normalized phone:', normPhone);
    }

    let user: User;

    if (email || normPhone) {
      console.log('Checking for existing user with email or phone...');
      if (email) {
        console.log('Checking email:', email);
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
          console.log('Found existing user by email:', existingUser);
          return res.status(200).send({
            status: 'EXISTING_USER',
            user: {
              id: existingUser.id,
              uuid: existingUser.uuid,
              name: existingUser.name,
              email: existingUser.email,
              phone: existingUser.phone,
              is_guest: existingUser.is_guest,
            },
          });
        }
      }

      if (normPhone) {
        console.log('Checking phone:', normPhone);
        const existingUser = await getUserByPhone(normPhone);
        if (existingUser) {
          console.log('Found existing user by phone:', existingUser);
          return res.status(200).send({
            status: 'EXISTING_USER',
            user: {
              id: existingUser.id,
              uuid: existingUser.uuid,
              name: existingUser.name,
              email: existingUser.email,
              phone: existingUser.phone,
              is_guest: existingUser.is_guest,
            },
          });
        }
      }

      console.log('Creating new user with email/phone...');
      user = await createUser({
        email: email ?? undefined,
        phone: normPhone ?? undefined,
        name,
        is_guest: false,
      });
    } else {
      console.log('Creating new guest user...');
      user = await createUser({
        name,
        is_guest: true,
      });
    }

    console.log('User created successfully:', {
      id: user.id,
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      phone: user.phone,
      is_guest: user.is_guest,
    });

    try {
      console.log('Attempting to publish user created event to Kafka...');
      await producer.send({
        topic: 'user-created',
        messages: [
          {
            value: JSON.stringify({
              id: user.id,
              uuid: user.uuid,
              name: user.name,
              email: user.email,
              phone: user.phone,
              is_guest: user.is_guest,
              date_created: user.date_created,
            }),
          },
        ],
      });
      console.log('Kafka event published successfully');
    } catch (err) {
      console.error('Failed to publish Kafka event:', err);
    }

    console.log('Creating session for user...');
    console.log('Using user.id:', user.id, 'type:', typeof user.id);
    const session = await createSession(user.id, null, 'web');
    console.log('Session created successfully:', session);

    let magicLinkToken = null;
    if (user.email || user.phone) {
      console.log('Creating magic link token...');
      console.log('Using user.id:', user.id, 'type:', typeof user.id);
      const magicLink = await createMagicLinkToken(user.id);
      magicLinkToken = magicLink.token;
      console.log('Magic link token created:', magicLinkToken);
    }

    console.log('Creating JWT...');
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
    console.log('JWT created successfully');

    req.session = {
      jwt: userJwt,
    };

    console.log('Sending success response...');
    res.status(201).send({
      userUuid: user.uuid,
      jwt: userJwt,
      sessionToken: session.session_token,
      magicLinkToken,
    });
  } catch (err) {
    console.error('Error in create-user route:', err);
    throw err;
  }
}) as RequestHandler);

export { router as createUserRouter };
