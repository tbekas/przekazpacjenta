import { AppSyncResolverHandler } from 'aws-lambda';
import { db } from '../database';
import { Category } from '../graphql/dto';
import { toCategoryDto } from './category-mapping';

interface Params {
  archived?: boolean;
}

export const handler: AppSyncResolverHandler<Params, Category[]> = async (event) => {
  const lang = 'pl'; // should be taken from user attributes
  const { archived } = event.arguments;

  console.log(archived);
  const categories = await db
    .selectFrom('category')
    .selectAll()
    .if(archived !== undefined, (qb) => qb.where('archived', '=', archived || false))
    .execute();

  return categories.map((c) => toCategoryDto(lang, c));
};
