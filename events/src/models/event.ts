export interface Event {
  id: number;
  status: number;
  type: string | null;
  name: string;
  activity_id: number | null;
  description: string | null;
  frequency: string | null;
  access_code: string | null;
  date_created: Date;
  lastModified: Date;
}
