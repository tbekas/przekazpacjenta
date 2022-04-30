import { Kysely, sql } from 'kysely';

async function up(db: Kysely<any>): Promise<void> {
  await sql`create extension "uuid-ossp"`.execute(db);
}

async function down(db: Kysely<any>): Promise<void> {
  await sql`drop extension "uuid-ossp"`.execute(db);
}

export default { up, down };
