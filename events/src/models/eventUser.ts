export interface EventUser {
  id: number;
  event_id: number;
  user_id: number;
  role: string;
  rsvpStatus: boolean;
  response: string;
  date_created: Date;
  last_modified: Date;
}
