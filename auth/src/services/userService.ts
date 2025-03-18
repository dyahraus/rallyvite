import pool from './db';
import { User } from '../models/user';

// Create a new user
export const createUser = async (user: Partial<User>): Promise<User> => {
  const result = await pool.query<User>(
    `
    INSERT INTO users (
      number, uuid, name, nick_name, email, phone, postal_code,
      latitude, longitude, birth_date, gender, password, is_verified, status
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12, $13, $14
    ) RETURNING *;
    `,
    [
      user.number,
      user.uuid,
      user.name,
      user.nick_name,
      user.email,
      user.phone,
      user.postal_code,
      user.latitude,
      user.longitude,
      user.birth_date,
      user.gender,
      user.password,
      user.is_verified,
      user.status,
    ]
  );

  return result.rows[0];
};

// Get a user by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query<User>(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
};
