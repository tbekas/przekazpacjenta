import { Category } from '../graphql/dto';
import { toAWSDateTime } from '../graphql/helpers';
import { CategoryRow } from '../database/schema/category-table';

export function toCategoryDto(lang: 'pl' | 'en', { pl, en, createdAt, ...rest }: CategoryRow): Category {
  return {
    ...rest,
    ...JSON.parse(JSON.parse({ pl, en }[lang])), // the string is json-escaped, hence the double parsing
    createdAt: toAWSDateTime(createdAt),
  };
}
