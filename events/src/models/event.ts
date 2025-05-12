export interface Event {
  id: number;
  uuid: string;
  status: number;
  name: string;
  activity_id: number | null;
  description: string | null;
  duration: string | null;
  frequency: string | null;
  access_code: string | null;
  is_recurring: boolean;
  repeat_interval_weeks: number | null;
  date_completed: Date | null;
  date_created: Date;
  last_modified: Date;
}
