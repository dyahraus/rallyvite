export interface EventDate {
  id: number;
  eventId: number;
  locationId: number;
  date: Date;
  status: number;
  dateLastNotification: Date | null;
  dateCreated: Date;
  lastModified: Date;
}
