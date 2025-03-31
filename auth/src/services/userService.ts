import pool from '../config/db';
import { User } from '../models/user';
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';
import { BadRequestError } from '../errors/bad-request-error';

// Create a new user
export const createUser = async (user: Partial<User>): Promise<User> => {
  const result = await pool.query<User>(
    `
    INSERT INTO users (
      uuid, name, nick_name, email, phone, is_verified, status
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7
    ) RETURNING *;
    `,
    [
      user.uuid,
      user.name,
      user.nick_name,
      user.email,
      user.phone,
      user.is_verified ?? false,
      user.status ?? 1, // you can default status to active
      user.is_guest ?? false,
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

// Get a user by phone
export const getUserByPhone = async (phone: string): Promise<User | null> => {
  const normalizedPhone = normalizePhoneNumber(phone.trim());
  if (!normalizedPhone) {
    throw new BadRequestError('Invalid phone number format');
  }

  const result = await pool.query<User>(
    'SELECT * FROM users WHERE phone = $1',
    [normalizedPhone]
  );
  return result.rows[0] || null;
};

export const normalizePhoneNumber = (
  phone: string,
  defaultCountry: CountryCode = 'US'
): string | null => {
  if (!phone) return null;

  const parsedNumber = parsePhoneNumberFromString(phone.trim(), {
    defaultCountry,
  });

  if (!parsedNumber || !parsedNumber.isValid()) {
    return null;
  }

  return parsedNumber.number;
};
