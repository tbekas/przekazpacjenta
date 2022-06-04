import { Insertable, Selectable } from 'kysely';

export interface VacancyAdCategoryTable {
  vacancyAdId: string;
  categoryId: string;
}

export type VacancyAdCategoryRow = Selectable<VacancyAdCategoryTable>;
export type InsertableVacancyAdCategoryRow = Insertable<VacancyAdCategoryTable>;