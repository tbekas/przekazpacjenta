import { Kysely, sql } from 'kysely';

async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('userFacility')
    .addColumn('facilityId', 'uuid', (col) => col.notNull().references('facility.id'))
    .addColumn('userId', 'uuid', (col) => col.notNull().references('user.id'))
    .addColumn('createdAt', 'timestamptz', (col) =>col.defaultTo(sql`now()`))
    .addPrimaryKeyConstraint('userFacilityPk', ['facilityId', 'userId'])
    .execute()
}

async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('userFacility').execute()
}

export default { up, down }
