import { PostConfirmationTriggerHandler } from 'aws-lambda';
import { db } from '../database';
import { sql } from 'kysely';

export const handler: PostConfirmationTriggerHandler = async (event) => {
  const user = await db
    .selectFrom('user')
    .where('id', '=', sql`uuid(${event.userName})`)
    .executeTakeFirst();

  if (user) {
    console.log(`User ${event.userName} already exists`);
  } else {
    const userValues = {
      id: sql`uuid(${event.userName})`.castTo<string>(),
      email: event.request.userAttributes.email,
      name: event.request.userAttributes.name,
    };

    await db.insertInto('user').values(userValues).execute();

    console.log(`User ${event.userName} created`);
  }
  return event;
};
