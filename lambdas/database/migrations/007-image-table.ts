import { Kysely, sql } from 'kysely';

async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('image')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('filename', 'text', (col) => col.notNull())
    .addColumn('mimeType', 'text', (col) => col.notNull())
    .addColumn('processed', 'boolean', (col) => col.defaultTo('false'))
    .addColumn('url', 'text')
    .addColumn('thumbnailsJson', 'text')
    .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`now()`))
    .execute();
}

async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('image').execute();
}

export default { up, down };
