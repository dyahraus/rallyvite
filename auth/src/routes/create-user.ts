import express, { Request, Response } from 'express';
import { createUser, getUserByEmail } from '../services/userService';
import pool from '../services/db';
import { User } from '../models/user';

const router = express.Router();

router.post('/api/users/createuser', async (req: Request, res: Response) => {
  // Check if user has a cookie (is logged in)
  // Create event with the user
  if (currentUser) {
  }

  // Check if a user has inputted phone and email
  // If yes, find an account

  const {
    number,
    uuid,
    name,
    nick_name,
    email,
    phone,
    postal_code,
    latitude,
    longitude,
    birth_date,
    gender,
    password,
    is_verified = false,
    status = 1,
  } = req.body;

  res.status(200).send({});

  // // Simple validation
  // if (!email || !password || !uuid) {
  //   return res
  //     .status(400)
  //     .json({ error: 'Email, password, and UUID are required.' });
  // }

  // try {
  //   // Check if the user already exists
  //   const existingUser = await getUserByEmail(email);
  //   if (existingUser) {
  //     return res
  //       .status(409)
  //       .json({ error: 'User with this email already exists.' });
  //   }

  //   // Create the new user
  //   const user = await createUser({
  //     number,
  //     uuid,
  //     name,
  //     nick_name,
  //     email,
  //     phone,
  //     postal_code,
  //     latitude,
  //     longitude,
  //     birth_date,
  //     gender,
  //     password,
  //     is_verified,
  //     status,
  //   });

  //   return res.status(201).json({ user });
  // } catch (error) {
  //   console.error('Error creating user:', error);
  //   return res.status(500).json({ error: 'Failed to create user.' });
  // }
});

export { router as createUserRouter };
