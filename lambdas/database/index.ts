import { FacilityTable } from './schema/facility-table';
import { Kysely } from 'kysely';
import { DataApiDialect } from 'kysely-data-api';
import { assertDefinedReturn } from '../utils/assertions';
import { RDSDataService } from 'aws-sdk';
import { UserTable } from './schema/user-table';
import { EnrollmentTable } from './schema/enrollment-table';
import { UserFacilityTable } from './schema/user-facility-table';

export interface Database {
  facility: FacilityTable;
  user: UserTable;
  enrollment: EnrollmentTable;
  userFacility: UserFacilityTable;
}

export const dataApi = new DataApiDialect({
  mode: 'postgres',
  driver: {
    client: new RDSDataService(),
    database: assertDefinedReturn(process.env.DATABASE),
    resourceArn: assertDefinedReturn(process.env.CLUSTER_ARN),
    secretArn: assertDefinedReturn(process.env.SECRET_ARN),
  },
});

export const db = new Kysely<Database>({ dialect: dataApi, log: ['query', 'error'] });
