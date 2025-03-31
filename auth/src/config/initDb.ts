import pool from './db';
import fs from 'fs';
import path from 'path';

const runMigrations = async () => {
  try {
    console.log('Running database migrations...');

    // Read all migration files
    const migrationFiles = fs
      .readdirSync(path.join(__dirname, '../migrations'))
      .filter((file) => file.endsWith('.sql'))
      .sort(); // Ensures files execute in correct order

    for (const file of migrationFiles) {
      const filePath = path.join(__dirname, '../migrations', file);
      const sql = fs.readFileSync(filePath, 'utf8');

      console.log(`Executing migration: ${file}`);
      await pool.query(sql);
    }

    console.log('All migrations executed successfully!');
  } catch (error) {
    console.error('Error running migrations:', error);
  } finally {
    await pool.end();
  }
};

runMigrations();
