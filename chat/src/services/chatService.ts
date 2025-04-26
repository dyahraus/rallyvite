import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db';
import { Chat } from '../models/chat';

interface CreateMessageParams {
  event_uuid: string;
  user_uuid: string;
  content: string | null;
  image_url: string | null;
}

export const createMessage = async ({
  event_uuid,
  user_uuid,
  content,
  image_url,
}: CreateMessageParams): Promise<Chat> => {
  console.log('Creating new message with params:', {
    event_uuid,
    user_uuid,
    content,
    image_url,
  });

  const messageUuid = uuidv4();
  const query = `
    WITH new_message AS (
      INSERT INTO messages (uuid, event_uuid, user_uuid, content, image_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    )
    SELECT 
      m.id,
      m.uuid,
      m.event_uuid,
      m.user_uuid,
      m.content,
      m.image_url,
      m.created_at,
      u.name as user_name,
      u.nick_name as user_nick_name,
      u.profile_picture_url as user_profile_picture_url
    FROM new_message m
    JOIN users u ON m.user_uuid = u.uuid
  `;

  const values = [messageUuid, event_uuid, user_uuid, content, image_url];

  try {
    const result = await pool.query(query, values);
    const message = result.rows[0];

    return {
      id: message.id,
      uuid: message.uuid,
      event_uuid: message.event_uuid,
      user_uuid: message.user_uuid,
      content: message.content,
      image_url: message.image_url,
      created_at: message.created_at,
      user_name: message.user_name,
      user_nick_name: message.user_nick_name,
      user_profile_picture_url: message.user_profile_picture_url,
    };
  } catch (err) {
    console.error('Error creating message:', err);
    throw err;
  }
};

export const getMessagesByEvent = async (
  event_uuid: string
): Promise<Chat[]> => {
  console.log('Retrieving messages for event:', event_uuid);

  const query = `
    SELECT 
      m.id,
      m.uuid,
      m.event_uuid,
      m.user_uuid,
      m.content,
      m.image_url,
      m.created_at,
      u.name as user_name,
      u.nick_name as user_nick_name,
      u.profile_picture_url as user_profile_picture_url
    FROM messages m
    JOIN users u ON m.user_uuid = u.uuid
    WHERE m.event_uuid = $1
    ORDER BY m.created_at ASC
  `;

  try {
    const result = await pool.query(query, [event_uuid]);
    console.log(`Found ${result.rows.length} messages for event ${event_uuid}`);

    return result.rows.map((message) => ({
      id: message.id,
      uuid: message.uuid,
      event_uuid: message.event_uuid,
      user_uuid: message.user_uuid,
      content: message.content,
      image_url: message.image_url,
      created_at: message.created_at,
      user_name: message.user_name,
      user_nick_name: message.user_nick_name,
      user_profile_picture_url: message.user_profile_picture_url,
    }));
  } catch (err) {
    console.error('Error retrieving messages:', err);
    throw err;
  }
};
