import { Kysely } from 'kysely';

const debugEmails = process.env.DEBUG_EMAILS?.split(',') || []
const debugFacilities = debugEmails.map((e, i) => ({
    name: `Szpital ${i}`,
    email: e,
    phoneNumber: "+48123456789",
    streetWithNumber: "ul. Szpitalna 1", 
    zipCode: "01-234", 
    city: "Warszawa"
}))

async function up(db: Kysely<any>): Promise<void> {
  await db.insertInto('facility')
    .values(debugFacilities)
    .execute()
}

async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom('facility')
    .where('email', 'in', debugFacilities.map((f) => f.email))
    .execute()
    
}

export default { up, down }