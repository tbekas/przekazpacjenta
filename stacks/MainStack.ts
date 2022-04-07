import * as sst from "@serverless-stack/resources";
import * as cdk from "aws-cdk-lib";
import { custom_resources as cr, aws_iam as iam, aws_route53 as route53 } from "aws-cdk-lib";
import * as appsync from "@aws-cdk/aws-appsync-alpha";

export interface MainStackProps extends sst.StackProps {
  hostedZoneName: string,
  siteDomainName: string,
  emailDomainName: string,
}

export default class MainStack extends sst.Stack {
  readonly rds: sst.RDS;
  readonly dbName: string;

  constructor(scope: sst.App, id: string, props: MainStackProps) {
    super(scope, id, props);

    const dbName = `${scope.name}`;
    const rds = new sst.RDS(this, "Database", {
      engine: "postgresql10.14",
      defaultDatabaseName: dbName,
    });

    const auth = new sst.Auth(this, "Auth", {
      cognito: {
        userPool: {
          signInAliases: {
            username: false,
            email: true,
          },
        },
      },
    });

    /**
     * API
     */

    const api = new sst.AppSyncApi(this, "AppSyncApi", {
      defaultFunctionProps: {
        environment: {
          DATABASE: dbName,
          CLUSTER_ARN: rds.clusterArn,
          SECRET_ARN: rds.secretArn,
        },
        permissions: [rds],
      },
      graphqlApi: {
        schema: "graphql/schema.graphql",
        authorizationConfig: {
          ...(auth.cognitoUserPool
            ? {
                defaultAuthorization: {
                  authorizationType: appsync.AuthorizationType.USER_POOL,
                  userPoolConfig: {
                    userPool: auth.cognitoUserPool,
                  },
                },
              }
            : {}),
          additionalAuthorizationModes: [
            {
              authorizationType: appsync.AuthorizationType.API_KEY,
              apiKeyConfig: {
                expires: cdk.Expiration.after(cdk.Duration.days(365)),
              },
            },
          ],
        },
      },
      dataSources: {
        facilities: "lambdas/facility/query.handler",
      },
      resolvers: {
        "Query    facilities": "facilities",
      },
    });

    /**
     * Site
     */

    const siteDomain =
      scope.stage === "prod"
        ? props.siteDomainName
        : `${scope.stage}.${props.siteDomainName}`;
    const site = new sst.ReactStaticSite(this, "ReactSite", {
      path: "site",
      customDomain: {
        domainName: siteDomain,
        domainAlias: `www.${siteDomain}`,
        hostedZone: props.hostedZoneName,
      },
      environment: {
        REACT_APP_GRAPHQL_ENDPOINT: api.graphqlApi.graphqlUrl || api.url,
        REACT_APP_REGION: scope.region,
        ...(auth.cognitoUserPool
          ? {
              REACT_APP_USERPOOL_ID: auth.cognitoUserPool.userPoolId,
            }
          : {}),
        ...(auth.cognitoUserPoolClient
          ? {
              REACT_APP_USERPOOL_CLIENT_ID:
                auth.cognitoUserPoolClient.userPoolClientId,
            }
          : {}),
      },
    });

    /**
     * SES
     */
    const verifyDomainIdentity = new cr.AwsCustomResource(
      this,
      "VerifyDomainIdentity",
      {
        onCreate: {
          service: "SES",
          action: "verifyDomainIdentity",
          parameters: {
            Domain: props.emailDomainName,
          },
          physicalResourceId:
            cr.PhysicalResourceId.fromResponse("VerificationToken"),
        },
        policy: cr.AwsCustomResourcePolicy.fromStatements([
          new iam.PolicyStatement({
            resources: ["*"],
            actions: ["ses:VerifyDomainIdentity"],
          }),
        ]),
      }
    );  

    const hostedZone = route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName: props.hostedZoneName,
    });

    new route53.TxtRecord(this, "SESVerificationRecord", {
      zone: hostedZone,
      recordName: `_amazonses.${props.emailDomainName}`,
      values: [verifyDomainIdentity.getResponseField("VerificationToken")],
    });

    this.addOutputs({
      SiteAddress: site.customDomainUrl || site.url,
      ApiEndpoint: api.graphqlApi.graphqlUrl,
      ApiKey: api.graphqlApi.apiKey || "api key not found",
      RdsSecretArn: rds.secretArn,
    });
    this.rds = rds
    this.dbName = dbName
  }
}
