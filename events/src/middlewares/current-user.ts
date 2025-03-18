import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Extend Express's Request interface to include `currentUser` and `session`
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
      session?: {
        jwt?: string;
      };
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {}

  next();
};
