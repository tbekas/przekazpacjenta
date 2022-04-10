import { AppSyncIdentityCognito } from 'aws-lambda'
import { Transaction } from 'kysely';
import { Database } from '../database'

export interface MutationParams<T> {
  input: T;
}

export interface MutationHandlerParams<T> {
  input: T;
  identity: AppSyncIdentityCognito;
  trx: Transaction<Database>;
}

export type MutationHandler<TArgs, TResult> = (params: MutationHandlerParams<TArgs>) => Promise<TResult>

export function toAWSDateTime(timestamptz: string): string {
  return new Date(Date.parse(timestamptz.concat('Z'))).toISOString()
}