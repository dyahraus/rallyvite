export interface Location {
  id: number;
  uuid: string;
  type: string | null;
  name: string;
  description: string | null;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  googlePlaceId: string | null;
  source: string | null;
  dateCreated: Date;
  lastModified: Date;
}
