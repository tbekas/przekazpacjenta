import { Handler } from 'aws-lambda';
import { dataApi } from '.';
import { Kysely, Migrator, MigrationResult, NO_MIGRATIONS } from 'kysely';
import * as migrations from './migrations';

interface ApplyUnapplyEvent {
  logQuery?: boolean;
}

export const applyHandler: Handler<ApplyUnapplyEvent, void> = async ({ logQuery }) => {
  console.log(`Applying migrations`);

  const migrator = createMigrator(logQuery);
  const { error, results } = await migrator.migrateToLatest();

  logResults(results);

  if (error) {
    throw error;
  }
};

export const unapplyHandler: Handler<ApplyUnapplyEvent, void> = async ({ logQuery }) => {
  console.log(`Unapplying migrations`);

  const migrator = createMigrator(logQuery);
  const { error, results } = await migrator.migrateTo(NO_MIGRATIONS);

  logResults(results);

  if (error) {
    throw error;
  }
};

export const migrateDownHandler: Handler<ApplyUnapplyEvent, void> = async ({ logQuery }) => {
  console.log('Migrating down')


  const migrator = createMigrator(logQuery);
  const { error, results } = await migrator.migrateDown();

  logResults(results);

  if (error) {
    throw error;
  }
}

function createMigrator(logQuery?: boolean) {
  const db = new Kysely<unknown>({ dialect: dataApi, log: logQuery ? ['query', 'error'] : ['error'] });
  const getMigrations = async () => {
    return migrations;
  };
  return new Migrator({
    db,
    provider: { getMigrations },
  });
}

function logResults(results?: MigrationResult[]) {
  results?.forEach((m) => {
    console.log(`Migration ${m.migrationName} direction ${m.direction} status ${m.status}`);
  });
}
