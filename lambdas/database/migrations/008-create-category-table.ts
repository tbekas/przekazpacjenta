import { Kysely, sql } from 'kysely';

async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('category')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('pl', 'jsonb', (col) => col.notNull())
    .addColumn('en', 'jsonb', (col) => col.notNull())
    .addColumn('archived', 'boolean', (col) => col.defaultTo('false'))
    .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`now()`))
    .execute();
}

async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('category').execute();
}

export default { up, down };
