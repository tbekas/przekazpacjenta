import * as sst from "@serverless-stack/resources";

export interface MigrationsStackProps extends sst.StackProps {
  rds: sst.RDS,
  dbName: string,
  debugEmails: string,
}

export default class MigrationsStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props: MigrationsStackProps) {
    super(scope, id, props);


    const commonProps = {
      environment: {
        DATABASE: props.dbName,
        CLUSTER_ARN: props.rds.clusterArn,
        SECRET_ARN: props.rds.secretArn,
        DEBUG_EMAILS: scope.stage === "prod" ? "" : props.debugEmails,
      },
      permissions: [props.rds],
      enableLiveDev: true,
      timeout: 60
    }

    new sst.Function(this, "ApplyMigrations", {
      handler: "lambdas/database/apply-unapply-migrations.applyHandler",
      ...commonProps,
    })
    
    new sst.Function(this, "UnapplyMigrations", {
      handler: "lambdas/database/apply-unapply-migrations.unapplyHandler",
      ...commonProps,
    })
    
    
  }
}