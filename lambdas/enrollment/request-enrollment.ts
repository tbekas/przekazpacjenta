import { AppSyncResolverHandler, AppSyncIdentityCognito } from 'aws-lambda';
import aws from 'aws-sdk';
import { Enrollment } from '../graphql/dto';
import { MutationParams, MutationHandler } from '../graphql/helpers';
import { db } from '../database';
import { sql } from 'kysely';
import * as crypto from 'crypto';
import { toFacilityDto } from '../facility/facility-mapping';
import { toEnrollmentDto } from './entrollment-mapping';
import { FacilityRow } from '../database/schema/facility-table';
import { UserRow } from '../database/schema/user-table';
import { subject, body } from './email-template';
import { assertDefinedReturn } from '../utils/assertions';

const ses = new aws.SESV2();

interface RequestEnrollmentInput {
  facilityId: string;
}

export const handler: AppSyncResolverHandler<MutationParams<RequestEnrollmentInput>, Enrollment> = async (event) => {
  const identity = event.identity as AppSyncIdentityCognito;
  const input = event.arguments.input;

  return await db.transaction().execute((trx) => mutationHandler({ input, identity, trx }));
};

const mutationHandler: MutationHandler<RequestEnrollmentInput, Enrollment> = async ({ input, identity, trx }) => {
  const user = await trx
    .selectFrom('user')
    .selectAll()
    .where('id', '=', sql`uuid(${identity.username})`)
    .executeTakeFirstOrThrow();

  const facility = await trx
    .selectFrom('facility')
    .selectAll()
    .where('id', '=', sql`uuid(${input.facilityId})`)
    .executeTakeFirstOrThrow();

  const activeEnrollments = await trx
    .selectFrom('enrollment')
    .selectAll()
    .where('userId', '=', sql`uuid(${user.id})`)
    .where('facilityId', '=', sql`uuid(${facility.id})`)
    .where((qb) => qb.where('approved', '=', true).orWhere('expirationAt', '>', sql`now()`))
    .execute();
  if (activeEnrollments.length > 0) {
    throw new Error(
      'User is already enrolled or there are non-expired enrollments awaiting for approval in given facility'
    );
  }

  const approvalToken = createApprovalToken();

  const emailRequest = createEmailRequest(approvalToken, facility, user);
  const sendEmailresult = await ses.sendEmail(emailRequest).promise();
  if (sendEmailresult.$response.error) {
    throw new Error(sendEmailresult.$response.error.message);
  }

  const enrollmentValues = {
    userId: sql`uuid(${user.id})`.castTo<string>(),
    facilityId: sql`uuid(${facility.id})`.castTo<string>(),
    approved: false,
    approvalTokenHash: crypto.createHash('md5').update(approvalToken).digest('hex'),
    expirationAt: sql`now() + interval '1 day'`.castTo<string>(),
  };

  const enrollment = await trx
    .insertInto('enrollment')
    .values(enrollmentValues)
    .returningAll()
    .executeTakeFirstOrThrow();

  return {
    facility: toFacilityDto(facility),
    ...toEnrollmentDto(enrollment),
  };
};

function createApprovalToken(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function createEmailRequest(approvalToken: string, facility: FacilityRow, user: UserRow): aws.SESV2.SendEmailRequest {
  return {
    FromEmailAddress: assertDefinedReturn(process.env.SENDER_EMAIL),
    Destination: { ToAddresses: [facility.email] },
    ReplyToAddresses: [assertDefinedReturn(process.env.REPLY_TO_EMAIL)],
    Content: {
      Simple: {
        Subject: {
          Data: subject({ user }),
        },
        Body: {
          Html: {
            Data: body({
              user,
              facility,
              approvalToken,
              supportEmail: assertDefinedReturn(process.env.SUPPORT_EMAIL),
            }),
          },
        },
      },
    },
  };
}
