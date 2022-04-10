import { Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface UserTable {
  id: Generated<string>;
  email: string;
  name: string;
  phoneNumber?: string;
  createdAt: Generated<string>;
}

export type UserRow = Selectable<UserTable>
export type InsertableUserRow = Insertable<UserTable>
export type UpdateableUserRow = Updateable<UserTable>
