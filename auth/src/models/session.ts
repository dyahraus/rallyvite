export interface Session {
  id: number;
  user_id: number;
  session_token: string;
  device_id: string | null;
  session_type: string | null;
  created_at: Date;
  expires_at: Date;
  invalidated: boolean;
}
