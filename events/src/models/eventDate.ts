export interface EventDate {
  id: number;
  event_id: number;
  location_id: number;
  date: Date;
  status: number;
  dateLastNotification: Date | null;
  dateCreated: Date;
  lastModified: Date;
}
