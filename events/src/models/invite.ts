export interface Invite {
  id: number;
  event_uuid: number;
  invited_by_user_id: number | null;
  token: string;
  status: number; // 1 = unopened, 2 = opened, 3 = joined
  joined_user_id: number | null;
  date_created: Date;
  last_modified: Date;
}
