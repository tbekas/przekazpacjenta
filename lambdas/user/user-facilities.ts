import { AppSyncResolverHandler } from 'aws-lambda';
import { db } from '../database';
import { Facility, User } from '../graphql/dto';
import { sql } from 'kysely';
import { toFacilityDto } from '../facility/facility-mapping';

export const handler: AppSyncResolverHandler<void, Facility[], User> = async (event) => {
  const facilities = await db
    .selectFrom('userFacility as uf')
    .innerJoin('facility as f', 'uf.facilityId', 'f.id')
    .where('uf.userId', '=', sql`uuid(${event.source.id})`)
    .selectAll('f')
    .execute();

  return facilities.map(toFacilityDto);
};
