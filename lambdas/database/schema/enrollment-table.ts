import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface EnrollmentTable {
  id: Generated<string>;
  facilityId: string;
  userId: string;
  approved: boolean;
  approvalTokenHash: string;
  expirationAt: ColumnType<string, string, never>;
  createdAt: Generated<string>;
}

export type EnrollmentRow = Selectable<EnrollmentTable>
export type InsertableEnrollmentRow = Insertable<EnrollmentTable>
export type UpdateableEnrollmentRow = Updateable<EnrollmentTable>
