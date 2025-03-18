import pool from './db';

const initDb = async () => {
  try {
    await pool.query(`
      DROP TABLE IF EXISTS users;

      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        number VARCHAR(24) UNIQUE,
        uuid UUID,
        name VARCHAR(50) DEFAULT '',
        nick_name VARCHAR(50),
        email VARCHAR(60) DEFAULT '' UNIQUE,
        phone VARCHAR(30),
        postal_code VARCHAR(10),
        latitude DECIMAL(12, 6),
        longitude DECIMAL(12, 6),
        birth_date DATE,
        gender VARCHAR(10),
        password VARCHAR(60) DEFAULT '',
        pw VARCHAR(256),
        salt VARCHAR(16),
        date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_logon TIMESTAMP DEFAULT '1970-01-01 00:00:01',
        is_verified BOOLEAN DEFAULT false,
        status SMALLINT DEFAULT 1,
        onboard_page_number SMALLINT DEFAULT 1,
        push_enabled BOOLEAN DEFAULT false,
        push_subscription_json VARCHAR(1000),
        device_id VARCHAR(100) DEFAULT '',
        device_token VARCHAR(100) DEFAULT '',
        device_type SMALLINT DEFAULT 0,
        time_zone_offset VARCHAR(10) DEFAULT '',
        time_zone VARCHAR(30),
        email_subscriber BOOLEAN DEFAULT true,
        customer_id VARCHAR(100),
        channel VARCHAR(30),
        date_funnel_message TIMESTAMP,
        funnel_message_count SMALLINT DEFAULT 0,
        last_survey_completion TIMESTAMP,
        last_feedback_completion TIMESTAMP,
        date_last_read TIMESTAMP,
        date_last_fail_reminder TIMESTAMP,
        game_wins_count INTEGER DEFAULT 0,
        raw_data TEXT
      );
    `);
    console.log('Database schema created successfully!');
  } catch (error) {
    console.error('Error creating database schema:', error);
  } finally {
    await pool.end();
  }
};

initDb();
