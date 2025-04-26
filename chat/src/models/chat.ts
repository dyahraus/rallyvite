export interface Chat {
  id: number;
  uuid: string;
  event_uuid: string;
  user_uuid: string;
  content: string | null;
  image_url: string | null;
  created_at: Date;
  user_name: string;
  user_nick_name: string | null;
  user_profile_picture_url: string | null;
}
