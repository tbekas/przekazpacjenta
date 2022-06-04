import { VacancyAd } from '../graphql/dto';
import { toAWSDateTime } from '../graphql/helpers';
import { VacancyAdRow } from '../database/schema/vacancy-ad-table';

export function toVacancyAdDto({ id, name, description, collaborative, active, createdAt }: VacancyAdRow): VacancyAd {
  return {
    id,
    name,
    description,
    collaborative,
    active,
    createdAt: toAWSDateTime(createdAt),
  };
}
