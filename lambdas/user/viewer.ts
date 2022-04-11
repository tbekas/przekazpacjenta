import { AppSyncResolverHandler, AppSyncIdentityCognito } from "aws-lambda";
import { db } from "../database"
import { sql } from 'kysely';
import { User } from '../graphql/dto'
import { toUserDto } from "./user-mapping";

export const handler: AppSyncResolverHandler<void,User> = async (event) => {
  const identity = event.identity as AppSyncIdentityCognito
 
  const user = await db.selectFrom('user')
    .selectAll()
    .where('id', '=', sql`uuid(${identity.username})`)
    .executeTakeFirstOrThrow()
  
  return toUserDto(user);
};
