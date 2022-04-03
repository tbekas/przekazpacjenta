import MainStack from "./MainStack";
import * as sst from "@serverless-stack/resources";
import MigrationsStack from "./MigrationsStack";

export default function main(app: sst.App): void {
  app.setDefaultFunctionProps({
    runtime: "nodejs14.x",
  });

  const mainStack = new MainStack(app, "main-stack", {
    hostedZoneName: process.env.HOSTED_ZONE_NAME || "",
    siteDomainName: process.env.SITE_DOMAIN_NAME || "",
    emailDomainName: process.env.EMAIL_DOMAIN_NAME || "",
  });

  const migrationsStack = new MigrationsStack(app, "migrations-stack", {
    rds: mainStack.rds,
    dbName: mainStack.dbName,
    debugEmails: process.env.DEBUG_EMAILS || "",
  })

  migrationsStack.addDependency(mainStack)
}
