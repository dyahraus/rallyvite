import pool from '../config/db';
import { User } from '../models/user';

// Get a user by ID
export const findUserById = async (id: number): Promise<User | null> => {
  const result = await pool.query<User>('SELECT * FROM users WHERE id = $1', [
    id,
  ]);
  return result.rows[0] || null;
};

// Get a user by UUID
export const findUserByUuid = async (uuid: string): Promise<User | null> => {
  const result = await pool.query<User>('SELECT * FROM users WHERE uuid = $1', [
    uuid,
  ]);
  return result.rows[0] || null;
};
