export interface EventUser {
  id: number;
  event_id: number;
  user_id: number;
  role: string;
  rsvpStatus: boolean;
  date_created: Date;
  last_modified: Date;
}
