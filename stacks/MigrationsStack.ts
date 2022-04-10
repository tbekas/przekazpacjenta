import * as sst from "@serverless-stack/resources";

export interface MigrationsStackProps extends sst.StackProps {
  rds: sst.RDS,
  dbName: string,
  debugEmails: string,
}

export default class MigrationsStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props: MigrationsStackProps) {
    super(scope, id, props);

    const commonFnProps = {
      environment: {
        DATABASE: props.dbName,
        CLUSTER_ARN: props.rds.clusterArn,
        SECRET_ARN: props.rds.secretArn,
        DEBUG_EMAILS: scope.stage === "prod" ? "" : props.debugEmails,
      },
      permissions: [props.rds],
      timeout: 60,
    }

    new sst.Function(this, "ApplyMigrations", {
      handler: "lambdas/database/apply-unapply-migrations.applyHandler",
      ...commonFnProps,
    })
    
    new sst.Function(this, "UnapplyMigrations", {
      handler: "lambdas/database/apply-unapply-migrations.unapplyHandler",
      ...commonFnProps,
    })
    
    new sst.Function(this, "MigrateToMigration", {
      handler: "lambdas/database/apply-unapply-migrations.migrateToHandler",
      ...commonFnProps,
    })

    new sst.Script(this, "ApplyMigrationsAfterDeploy", {
      onCreate: "lambdas/database/apply-unapply-migrations.applyHandler",
      onUpdate: "lambdas/database/apply-unapply-migrations.applyHandler",
      defaultFunctionProps: {
        ...commonFnProps,
        enableLiveDev: false,
      },
    });
  }
}