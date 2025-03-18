export interface User {
  id: number;
  number: string;
  uuid: string;
  name: string;
  nick_name: string;
  email: string;
  phone: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  birth_date: Date;
  gender: string;
  password: string;
  date_created: Date;
  last_modified: Date;
  last_logon: Date;
  is_verified: boolean;
  status: number;
}
