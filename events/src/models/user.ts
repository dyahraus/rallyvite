export interface User {
  id: number;
  email: string;
  phone: string;
  uuid: string;
  name: string;
  nick_name: string;
  profile_picture_url: string | null;
  date_created: Date;
  last_modified: Date;
  last_logon: Date;
  is_verified: boolean;
  is_guest: boolean;
  status: number;
}
