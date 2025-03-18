export interface EventUser {
  eventId: number;
  userId: string; // UUID from auth service
  status?: number; // optional for input, defaults to 1
  type?: string | null;
  rolesJson?: Record<string, unknown> | null; // more type-safe than `any`
  dateCreated?: Date; // present in DB response but not required as input
}
