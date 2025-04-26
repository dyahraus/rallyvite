import pool from './db';
import fs from 'fs';
import path from 'path';

export const runMigrations = async () => {
  try {
    console.log('Running database migrations...');

    // Read all migration files
    const migrationFiles = fs
      .readdirSync(path.join(__dirname, '../migrations'))
      .filter((file) => file.endsWith('.sql'))
      .sort(); // Ensures files execute in the correct order

    for (const file of migrationFiles) {
      const filePath = path.join(__dirname, '../migrations', file);
      const sql = fs.readFileSync(filePath, 'utf8');

      console.log(`Executing migration: ${file}`);
      await pool.query(sql); // Execute each migration
    }

    console.log('All migrations executed successfully!');
  } catch (error) {
    console.error('Error running migrations:', error);
  }
  // Do not call pool.end() here. Let the pool stay open for future DB queries.
};
