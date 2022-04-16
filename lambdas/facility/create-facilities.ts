import { Handler } from 'aws-lambda';
import { db } from '../database';
import { v5 as uuidv5 } from 'uuid';
import { sql } from 'kysely';

const uuidNamespace = '2be0d00b-a32f-49b9-83ea-1cd3e015a3be';

interface CreateFacilitiesEvent {
  emails: string[];
}

/**
 * This lambda handler is intended for development purpose only
 */
export const handler: Handler<CreateFacilitiesEvent, void> = async ({ emails = [] }) => {
  console.log(`Inserting/updating ${emails.length} facilities`);

  const allValues = emails.map((e) => ({
    id: sql`uuid(${uuidv5(e, uuidNamespace)})`.castTo<string>(),
    name: `Szpital`,
    email: e,
    phoneNumber: '+48123456789',
    streetWithNumber: 'ul. Szpitalna 1',
    zipCode: '01-234',
    city: 'Warszawa',
  }));

  for await (const values of allValues) {
    const { id, ...rest } = values;

    const facility = await db
      .insertInto('facility')
      .values(values)
      .onConflict((oc) => oc.column('id').doUpdateSet(rest))
      .returningAll()
      .executeTakeFirstOrThrow();

    console.log(`Facility {id: ${facility.id}, email: ${facility.email}} inserted/updated`);
  }
};
