import express, { Request, Response } from 'express';
import {
  findEventByUuid,
  updateEventRepeatConfig,
} from '../services/eventService';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post(
  '/api/events/setrepeat/:uuid',
  async (req: Request, res: Response) => {
    console.log('route entered');
    const { uuid } = req.params;
    console.log('UUID: ', uuid);
    const { repeatInterval } = req.body;
    console.log('Repeat interval: ', repeatInterval);

    if (!repeatInterval || typeof repeatInterval !== 'string') {
      throw new BadRequestError('Missing or invalid repeatInterval in body');
    }

    // Parse the interval string
    const match = repeatInterval
      .trim()
      .toLowerCase()
      .match(/^(\d+)\s*(week|weeks|month|months)$/);
    if (!match) {
      throw new BadRequestError(
        'Invalid repeat interval format. Use formats like "2 weeks" or "1 month".'
      );
    }

    console.log('Match: ', match);

    const value = parseInt(match[1]);
    const unit = match[2];

    let intervalInWeeks: number;

    if (unit.startsWith('week')) {
      intervalInWeeks = value;
    } else if (unit.startsWith('month')) {
      // Approximate 1 month = 4 weeks
      intervalInWeeks = value * 4;
    } else {
      throw new BadRequestError('Unsupported interval unit');
    }

    console.log('interval: ', intervalInWeeks);

    try {
      const event = await findEventByUuid(uuid);
      if (!event) {
        throw new BadRequestError('Event not found');
      }

      const updatedEvent = await updateEventRepeatConfig(event.id, {
        is_recurring: true,
        repeat_interval_weeks: intervalInWeeks,
      });

      res.status(200).send({
        message: 'Repeat configuration updated successfully',
        event: updatedEvent,
      });
    } catch (err) {
      console.error('Failed to update repeat interval:', err);
      throw new BadRequestError('Failed to update repeat interval');
    }
  }
);

export { router as setRepeatIntervalRouter };
