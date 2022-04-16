import { Kysely, sql } from 'kysely';

async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('facility')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull())
    .addColumn('phoneNumber', 'text')
    .addColumn('streetWithNumber', 'text', (col) => col.notNull())
    .addColumn('zipCode', 'text', (col) => col.notNull())
    .addColumn('city', 'text', (col) => col.notNull())
    .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`now()`))
    .execute();
}

async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('facility').execute();
}

export default { up, down };
