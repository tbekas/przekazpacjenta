import { Kysely, sql } from 'kysely';

async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('user')
    .addColumn("id", 'uuid', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull())
    .addColumn('phoneNumber', 'text')
    .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`now()`))
    .execute()
}

async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('user').execute()
}

export default { up, down }
