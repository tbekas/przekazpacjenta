import { Kysely, sql } from 'kysely';

async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('facility')
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn('name', 'text')
    .addColumn('email', 'text')
    .addColumn('phoneNumber', 'text')
    .addColumn('streetWithNumber', 'text')
    .addColumn('zipCode', 'text')
    .addColumn('city', 'text')
    .addColumn('createdAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`)
    )
    .execute()
}

async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('facility').execute()
}

export default { up, down }