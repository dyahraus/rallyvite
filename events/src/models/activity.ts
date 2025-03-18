export interface Activity {
  id: number;
  status: number;
  type: string | null;
  name: string;
  description: string | null;
  placeType: string | null;
  placeKeywords: string | null;
  dateCreated: Date;
  lastModified: Date;
}
