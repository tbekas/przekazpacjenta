import { Generated, Insertable, Selectable, Updateable } from 'kysely';

export interface CategoryTable {
  id: Generated<string>;
  pl: string;
  en: string;
  archived: boolean;
  createdAt: Generated<string>;
}

export type CategoryRow = Selectable<CategoryTable>;
export type InsertableCategoryRow = Insertable<CategoryTable>;
export type UpdateableCategoryRow = Updateable<CategoryTable>;
