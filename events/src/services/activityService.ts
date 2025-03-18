import pool from '../config/db';
import { Activity } from '../models/activity';

export const createActivity = async (
  activity: Omit<Activity, 'id' | 'dateCreated' | 'lastModified'>
) => {
  const result = await pool.query<Activity>(
    `INSERT INTO activities (status, type, name, description, place_type, place_keywords)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      activity.status || 1,
      activity.type,
      activity.name,
      activity.description,
      activity.placeType,
      activity.placeKeywords,
    ]
  );
  return result.rows[0];
};

export const getAllActivities = async () => {
  const result = await pool.query<Activity>('SELECT * FROM activities');
  return result.rows;
};
