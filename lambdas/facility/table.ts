import { Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface FacilityTable {
  id: number,
  name: string
  email: string
  phoneNumber: string,
  streetWithNumber: string,
  zipCode: string,
  city: string,
  createdAt: Generated<Date>,
}

export type FacilityRow = Selectable<FacilityTable>
export type InsertableFacilityRow = Insertable<FacilityTable>
export type UpdateableFacilityRow = Updateable<FacilityTable>