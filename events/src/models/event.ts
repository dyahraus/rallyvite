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
  date_created: Date;
  lastModified: Date;
}
