import { Kysely, sql } from 'kysely';

async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('vacancyAd')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
    .addColumn('facilityId', 'uuid', (col) => col.notNull().references('facility.id'))
    .addColumn('userId', 'uuid', (col) => col.notNull().references('user.id'))
    .addColumn('name', 'text')
    .addColumn('description', 'text')
    .addColumn('collaborative', 'boolean', (col) => col.defaultTo('true'))
    .addColumn('active', 'boolean', (col) => col.defaultTo('true'))
    .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`now()`))
    .execute();
}

async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('vacancyAd').execute();
}

export default { up, down };