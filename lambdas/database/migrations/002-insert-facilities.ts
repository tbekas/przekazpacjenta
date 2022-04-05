import { Kysely } from 'kysely';
import facilities from "./002-facilities.json"

async function up(db: Kysely<any>): Promise<void> {

  
  await db.insertInto('facility')
    .values(facilities)
    .execute()
}

async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom('facility')
    .where('email', 'in', facilities.map((f) => f.email))
    .execute()
}

export default { up, down }