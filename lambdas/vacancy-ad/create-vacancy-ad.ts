import { AppSyncResolverHandler, AppSyncIdentityCognito } from 'aws-lambda';
import { VacancyAd } from '../graphql/dto';
import { MutationParams, MutationHandler } from '../graphql/helpers';
import { db } from '../database';
import { sql } from 'kysely';
import { toVacancyAdDto } from './vacancy-ad-mapping';

interface CreateVacancyAdInput {
  facilityId: string;
  name: string;
  description: string;
  collaborative: boolean;
  categoryIds: string[];
}

export const handler: AppSyncResolverHandler<MutationParams<CreateVacancyAdInput>, VacancyAd> = async (event) => {
  const identity = event.identity as AppSyncIdentityCognito;
  const input = event.arguments.input;

  return await db.transaction().execute((trx) => mutationHandler({ input, identity, trx }));
};

const mutationHandler: MutationHandler<CreateVacancyAdInput, VacancyAd> = async ({ input, identity, trx }) => {
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

  await trx
    .selectFrom('userFacility')
    .where('facilityId', '=', sql`uuid(${input.facilityId})`)
    .where('userId', '=', sql`uuid(${identity.username})`)
    .selectAll()
    .executeTakeFirstOrThrow();

  const vacancyAdValues = {
    userId: sql`uuid(${user.id})`.castTo<string>(),
    facilityId: sql`uuid(${facility.id})`.castTo<string>(),
    name: input.name,
    description: input.description,
    collaborative: input.collaborative,
    active: true,
  };

  const categoryIds = input.categoryIds.map(function (id) {
    return sql`uuid(${id})`.castTo<string>();
  });

  const validCategories = trx
    .selectFrom('category')
    .where('category.id', 'in', categoryIds)
    .where('archived', '=', false)
    .selectAll()
    .execute();

  if (input.categoryIds.length !== (await validCategories).length) throw new Error('Invalied categoryIds');

  const vacancyAdResult = await trx
    .insertInto('vacancyAd')
    .values(vacancyAdValues)
    .returningAll()
    .executeTakeFirstOrThrow();

  const vacancyAdCategoryValues = input.categoryIds.map((id) => ({
    vacancyAdId: sql`uuid(${vacancyAdResult.id})`.castTo<string>(),
    categoryId: sql`uuid(${id})`.castTo<string>(),
  }));

  await trx.insertInto('vacancyAdCategory').values(vacancyAdCategoryValues).execute();

  return {
    ...toVacancyAdDto(vacancyAdResult),
  };
};
