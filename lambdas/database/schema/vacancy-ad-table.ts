import { Generated, Insertable, Selectable, Updateable } from 'kysely';

export interface VacancyAdTable {
  id: Generated<string>;
  facilityId: string;
  userId: string;
  name: string;
  description: string;
  collaborative: boolean;
  active: boolean;
  createdAt: Generated<string>;
}

export type VacancyAdRow = Selectable<VacancyAdTable>;
export type InsertableVacancyAdRow = Insertable<VacancyAdRow>;
export type UpdateableVacancyAdRow = Updateable<VacancyAdRow>;
