import { AppSyncResolverHandler, AppSyncIdentityCognito } from 'aws-lambda';
import { db } from '../database';
import { Enrollment } from '../graphql/dto';
import { toEnrollmentDto } from './entrollment-mapping';
import { sql } from 'kysely';
import { toFacilityDto } from '../facility/facility-mapping';

interface Params {
  approved?: boolean;
}

export const handler: AppSyncResolverHandler<Params, Enrollment[]> = async (event) => {
  const identity = event.identity as AppSyncIdentityCognito;
  const approved = event.arguments.approved;

  const rows = await db
    .selectFrom('enrollment as e')
    .innerJoin('facility as f', 'e.facilityId', 'f.id')
    .where('e.userId', '=', sql`uuid(${identity.username})`)
    .if(approved !== undefined, (qb) => qb.where('e.approved', '=', approved || false))
    .select(['f.createdAt as f_createdAt', 'f.id as f_id', 'e.createdAt as e_createdAt', 'e.id as e_id'])
    .selectAll()
    .execute();

  return rows.map(({ f_id, f_createdAt, e_id, e_createdAt, ...rest }) => ({
    facility: toFacilityDto({ ...rest, id: f_id, createdAt: f_createdAt }),
    ...toEnrollmentDto({ ...rest, id: e_id, createdAt: e_createdAt }),
  }));
};
