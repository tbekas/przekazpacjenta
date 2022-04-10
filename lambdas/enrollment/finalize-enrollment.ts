import { AppSyncResolverHandler, AppSyncIdentityCognito } from 'aws-lambda';
import { Enrollment } from '../graphql/dto';
import { MutationParams, MutationHandler } from '../graphql/helpers';
import { db } from '../database';
import { sql } from 'kysely';
import * as crypto from 'crypto';
import { assertDefined } from '../utils/assertions';
import { toFacilityDto } from '../facility/facility-mapping';
import { toEnrollmentDto } from './entrollment-mapping';

interface FinalizeEnrollmentInput {
  enrollmentId: string;
  approvalToken: string;
}

export const handler: AppSyncResolverHandler<MutationParams<FinalizeEnrollmentInput>, Enrollment> = async (event) => {
  const identity = event.identity as AppSyncIdentityCognito;
  const input = event.arguments.input;

  return await db
    .transaction()
    .execute((trx) => mutationHandler({ input, identity, trx }));
};

const mutationHandler: MutationHandler<FinalizeEnrollmentInput, Enrollment> = async ({ input, identity, trx }) => {
  const enrollment = await trx
    .selectFrom('enrollment')
    .where('id', '=', sql`uuid(${input.enrollmentId})`)
    .where('userId', '=', sql`uuid(${identity.username})`)
    .where('expirationAt', '>', sql`now()`)
    .where('approved', '=', false)
    .selectAll()
    .executeTakeFirst();

  assertDefined(enrollment, 'Enrollment is either non-existent, expired or already approved');

  const approvalTokenHash = crypto
    .createHash('md5')
    .update(input.approvalToken)
    .digest('hex');

  if (approvalTokenHash !== enrollment.approvalTokenHash) {
    throw new Error('Invalid approval token');
  }

  const finalizedEnrollment = await trx
    .updateTable('enrollment')
    .set({ approved: true })
    .where('id', '=', sql`uuid(${input.enrollmentId})`)
    .returningAll()
    .executeTakeFirstOrThrow();

  await trx
    .insertInto('userFacility')
    .values({
      userId: sql`uuid(${finalizedEnrollment.userId})`.castTo<string>(),
      facilityId: sql`uuid(${finalizedEnrollment.facilityId})`.castTo<string>(),
    })
    .executeTakeFirstOrThrow();

  const facility = await trx
    .selectFrom('facility')
    .selectAll()
    .where('id', '=', sql`uuid(${finalizedEnrollment.facilityId})`)
    .executeTakeFirstOrThrow();

  return {
    facility: toFacilityDto(facility),
    ...toEnrollmentDto(finalizedEnrollment),
  };
};
