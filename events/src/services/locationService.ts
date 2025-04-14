import pool from '../config/db';
import { Location } from '../models/location';
import { v4 as uuidv4 } from 'uuid';

// Define a type for the input that makes appropriate fields optional
type LocationInput = {
  type?: string | null;
  name: string;
  description?: string | null;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  latitude?: number | null;
  longitude?: number | null;
  googlePlaceId?: string | null;
  source?: string | null;
};

export const createLocation = async (location: LocationInput) => {
  // Validate required fields
  if (!location.name) {
    throw new Error('Name is required for creating a location');
  }

  const result = await pool.query<Location>(
    `INSERT INTO locations (
      uuid, 
      type, 
      name, 
      description, 
      address, 
      city, 
      state, 
      zip, 
      country, 
      latitude, 
      longitude, 
      google_place_id, 
      source
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *`,
    [
      uuidv4(),
      location.type || null,
      location.name,
      location.description || null,
      location.address || '',
      location.city || '',
      location.state || '',
      location.zip || '',
      location.country || '',
      location.latitude || null,
      location.longitude || null,
      location.googlePlaceId || null,
      location.source || null,
    ]
  );
  return result.rows[0];
};

export const findLocationByNameAndAddress = async (
  name: string,
  address: string
) => {
  const result = await pool.query<Location>(
    `SELECT * FROM locations WHERE name = $1 AND address = $2 LIMIT 1`,
    [name, address]
  );
  return result.rows[0] || null;
};

export const getAllLocations = async () => {
  const result = await pool.query<Location>('SELECT * FROM locations');
  return result.rows;
};
