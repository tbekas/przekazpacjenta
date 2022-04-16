import { User } from '../graphql/dto';
import { UserRow } from '../database/schema/user-table';
import { toAWSDateTime } from '../graphql/helpers';

export function toUserDto({ createdAt, ...rest }: UserRow): User {
  return {
    ...rest,
    createdAt: toAWSDateTime(createdAt),
  };
}
