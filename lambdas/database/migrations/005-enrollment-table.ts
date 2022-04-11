import { Kysely, sql } from 'kysely';

async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('enrollment')
    .addColumn("id", 'uuid', (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
    .addColumn('facilityId', 'uuid', (col) => col.references('facility.id'))
    .addColumn('userId', 'uuid', (col) => col.references('user.id'))
    .addColumn('approved', 'boolean', (col) => col.defaultTo('false'))
    .addColumn('approvalTokenHash', 'varchar(32)', (col) => col.notNull())
    .addColumn('expirationAt', 'timestamptz', (col) => col.notNull())
    .addColumn('createdAt', 'timestamptz', (col) =>col.defaultTo(sql`now()`))
    .execute()
}

async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('enrollment').execute()
}

export default { up, down }
