import express, { Request, Response } from 'express';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post(
  '/api/events/append-organizer',
  async (req: Request, res: Response) => {
    const { name, phone, email } = req.body;

    if (!name) {
      throw new BadRequestError('Name is required');
    }

    if (phone || email) {
      // publish an event to create new user, await for a user to be created using KAFKA
    } else {
      // publish an event to create a new GUEST user, await
    }
  }
);

// Create a user with a name or phone and email

// if only name then create a temp user

// if phone or email as well create a permanent user

// append user to event as organizer
