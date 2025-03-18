export interface EventDate {
  id: number;
  eventId: number;
  status: number;
  dateStart: Date | null;
  dateEnd: Date | null;
  timeZone: string | null;
  description: string | null;
  location: string | null;
  placeId: number | null;
  dateLastNotification: Date | null;
  dateCreated: Date;
  lastModified: Date;
}
