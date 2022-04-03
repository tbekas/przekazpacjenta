import { FacilityTable } from '../facility/table';
import { Kysely } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import { throwIfUndefined } from "../utils/assertions";
import { RDSDataService } from "aws-sdk";

interface Database {
  facility: FacilityTable
}

export const dataApi = new DataApiDialect({
    mode: "postgres",
    driver: {
      client: new RDSDataService(),
      database: throwIfUndefined(process.env.DATABASE),
      resourceArn: throwIfUndefined(process.env.CLUSTER_ARN),
      secretArn: throwIfUndefined(process.env.SECRET_ARN),
    },
  });
  
export const db = new Kysely<Database>({ dialect: dataApi, log: ['query', 'error'] });