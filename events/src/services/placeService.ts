import pool from '../config/db';
import { Place } from '../models/place';

export const createPlace = async (
  place: Omit<Place, 'id' | 'dateCreated' | 'lastModified'>
) => {
  const result = await pool.query<Place>(
    `INSERT INTO places (status, type, name, description, address1, address2, city, state, zip, country, latitude, longitude, google_place_id, website_url, page_content, rating, ratings_count, business_hours_json)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
     RETURNING *`,
    [
      place.status || 1,
      place.type,
      place.name,
      place.description,
      place.address1,
      place.address2,
      place.city,
      place.state,
      place.zip,
      place.country,
      place.latitude,
      place.longitude,
      place.googlePlaceId,
      place.websiteUrl,
      place.pageContent,
      place.rating,
      place.ratingsCount,
      place.businessHoursJson,
    ]
  );
  return result.rows[0];
};

export const findPlaceByNameAndAddress = async (
  name: string,
  address1: string
) => {
  const result = await pool.query<Place>(
    `SELECT * FROM places WHERE name = $1 AND address1 = $2 LIMIT 1`,
    [name, address1]
  );
  return result.rows[0] || null;
};

export const getAllPlaces = async () => {
  const result = await pool.query<Place>('SELECT * FROM places');
  return result.rows;
};
