import { Insertable, Selectable } from 'kysely';

export interface UserFacilityTable {
  facilityId: string;
  userId: string;
}

export type UserFacilityRow = Selectable<UserFacilityTable>;
export type InsertableUserFacilityRow = Insertable<UserFacilityTable>;
