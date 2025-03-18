export interface Place {
  id: number;
  status: number;
  type: string | null;
  name: string;
  description: string | null;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  googlePlaceId: string | null;
  websiteUrl: string | null;
  pageContent: string | null;
  rating: string | null;
  ratingsCount: number | null;
  businessHoursJson: any; // consider `Record<string, unknown>` if structured
  dateCreated: Date;
  lastModified: Date;
}
