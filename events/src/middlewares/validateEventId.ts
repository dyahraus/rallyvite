import { Request, Response, NextFunction } from 'express';
import { validate as uuidValidate } from 'uuid';

export const validateEventId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Event ID is required' });
  }

  if (!uuidValidate(id)) {
    return res.status(400).json({ error: 'Invalid event ID format' });
  }

  next();
};
