import { AppSyncResolverHandler } from 'aws-lambda';
import { db } from '../database';
import { FacilitiesPage } from '../graphql/dto';
import { toFacilityDto } from './facility-mapping';

interface Params {
  query?: string;
  after?: string;
  before?: string;
  limit: number;
}

export const handler: AppSyncResolverHandler<Params, FacilitiesPage> = async (event) => {
  const facilities = await db.selectFrom('facility').selectAll().limit(event.arguments.limit).execute();

  const items = facilities.map(toFacilityDto);

  const pageInfo = {
    totalCount: items.length,
    first: 'dummy_cursor',
    last: 'dummy_cursor',
  };

  return {
    items,
    pageInfo,
  };
};
