import MainStack, { MainStackProps } from "./MainStack";
import * as sst from "@serverless-stack/resources";

export default function main(app: sst.App): void {
  app.setDefaultFunctionProps({
    runtime: "nodejs14.x",
  });

  new MainStack(app, "main-stack", {
    hostedZoneName: process.env.HOSTED_ZONE_NAME || "",
    siteDomainName: process.env.SITE_DOMAIN_NAME || "",
  });
}
