import express, { Request, Response, RequestHandler } from 'express';
import { findUserByUuid, updateUser } from '../services/userService';
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';
import { BadRequestError } from '../errors/bad-request-error';
import validator from 'validator';
import { User } from '../models/user';

interface EditUserRequest {
  uuid: string;
  name?: string;
  email?: string;
  mobileNumber?: string;
}

const router = express.Router();

router.put('/api/users/edit', async (req: Request, res: Response) => {
  try {
    console.log('Edit user request received:', req.body);
    const { uuid, name, email, mobileNumber } = req.body as EditUserRequest;

    if (!uuid) {
      console.log('Missing UUID in request');
      res.status(400).send({ error: 'User UUID is required' });
      return;
    }

    console.log('Finding user with UUID:', uuid);
    const user = await findUserByUuid(uuid);

    if (!user) {
      console.log('User not found with UUID:', uuid);
      res.status(404).send({ error: 'User not found' });
      return;
    }

    console.log('Current user data:', {
      name: user.name,
      email: user.email,
      phone: user.phone,
      is_guest: user.is_guest,
    });

    const updateData: Partial<User> = {};

    if (name !== undefined && name !== user.name) {
      console.log('Updating name from:', user.name, 'to:', name);
      updateData.name = name;
    }

    if (email !== undefined && email !== '' && email !== user.email) {
      console.log('Validating email:', email);
      if (!validator.isEmail(email)) {
        console.log('Invalid email format:', email);
        res.status(400).send({ error: 'Invalid email format' });
        return;
      }
      console.log('Updating email from:', user.email, 'to:', email);
      updateData.email = email;
    }

    let normalizedPhone = null;
    if (
      mobileNumber !== undefined &&
      mobileNumber !== '' &&
      mobileNumber !== user.phone
    ) {
      console.log('Validating phone number:', mobileNumber);
      normalizedPhone = parsePhoneNumberFromString(mobileNumber, {
        defaultCountry: 'US',
      });

      if (!normalizedPhone || !normalizedPhone.isValid()) {
        console.log('Invalid phone number format:', mobileNumber);
        res.status(400).send({ error: 'Invalid phone number format' });
        return;
      }
      console.log(
        'Updating phone from:',
        user.phone,
        'to:',
        normalizedPhone.number
      );
      updateData.phone = normalizedPhone.number;
    }

    if (!user.phone && !user.email) {
      console.log(
        'User has no email or phone, checking for conversion to regular user'
      );
      if (normalizedPhone?.isValid() || email) {
        console.log('Converting guest to regular user');
        updateData.is_guest = false;
      }
    }

    if (Object.keys(updateData).length > 0) {
      console.log('Updating user with data:', updateData);
      const updatedUser = await updateUser(uuid, updateData);
      console.log('User updated successfully:', {
        uuid: updatedUser.uuid,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        is_guest: updatedUser.is_guest,
      });
      res.status(200).send({
        message: 'User updated successfully',
        user: {
          uuid: updatedUser.uuid,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
        },
      });
      return;
    }

    console.log('No changes detected for user:', uuid);
    res.status(200).send({
      message: 'No changes detected',
      user: {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    if (error instanceof BadRequestError) {
      res.status(400).send({ error: error.message });
      return;
    }
    res.status(500).send({ error: 'Internal server error' });
  }
});

export { router as editUserRouter };
