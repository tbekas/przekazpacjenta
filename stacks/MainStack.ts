import * as sst from "@serverless-stack/resources";
import * as cdk from "aws-cdk-lib";
import { custom_resources as cr, aws_iam as iam, aws_route53 as route53 } from "aws-cdk-lib";
import * as appsync from "@aws-cdk/aws-appsync-alpha";

export interface MainStackProps extends sst.StackProps {
  hostedZoneName: string,
  siteDomainName: string,
  emailDomainName: string,
  senderEmailName: string,
  senderEmailLocalPart: string,
  replyToEmailLocalPart: string,
  supportEmailLocalPart: string,
}

export default class MainStack extends sst.Stack {
  readonly rds: sst.RDS;
  readonly dbName: string;

  constructor(scope: sst.App, id: string, props: MainStackProps) {
    super(scope, id, props);

    const timeout = scope.stage === "prod" ? 10 : 60;

    /**
     * RDS
     */
    const prodRdsScaling: sst.RDSScalingProps = {
      autoPause: false,
      minCapacity: "ACU_8",
      maxCapacity: "ACU_64",
    };
    const devRdsScaling: sst.RDSScalingProps = {
      autoPause: 60,
      minCapacity: "ACU_2",
      maxCapacity: "ACU_2",
    };
  
    const dbName = `${scope.name}`;
    const rds = new sst.RDS(this, "Database", {
      engine: "postgresql10.14",
      defaultDatabaseName: dbName,
      scaling: scope.stage === "prod" ? prodRdsScaling : devRdsScaling
    });

    const commonFnProps = {
      environment: {
        DATABASE: dbName,
        CLUSTER_ARN: rds.clusterArn,
        SECRET_ARN: rds.secretArn,
      },
      permissions: [rds],
      timeout,
    }

    /**
     * Auth
     */
    const auth = new sst.Auth(this, "Auth", {
      cognito: {
        userPool: {
          signInAliases: {
            username: false,
            email: true,
          },
        },
        userPoolClient: {
          accessTokenValidity: scope.stage === "prod" ? cdk.Duration.minutes(60) : cdk.Duration.days(1)
        },
        triggers: {
          postConfirmation: "lambdas/user/create-user.handler"
        },
        defaultFunctionProps: commonFnProps,
      },
    });

    /**
     * API
     */
    const api = new sst.AppSyncApi(this, "AppSyncApi", {
      defaultFunctionProps: commonFnProps,
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
        },
      },
      dataSources: {
        facilities: {
          handler: "lambdas/facility/facilities.handler",
          timeout,
        },
        viewer: {
          handler: "lambdas/user/viewer.handler",
          timeout,
        },
        enrollments: {
          handler: "lambdas/enrollment/enrollments.handler",
          timeout,
        },
        userFacilities: {
          handler: "lambdas/user/user-facilities.handler",
          timeout,
        },
        requestEnrollment: {
          handler: "lambdas/enrollment/request-enrollment.handler",
          environment: {
            SENDER_EMAIL: `"${props.senderEmailName}" <${props.senderEmailLocalPart}@${props.emailDomainName}>`,
            REPLY_TO_EMAIL: `${props.replyToEmailLocalPart}@${props.emailDomainName}`,
            SUPPORT_EMAIL: `${props.supportEmailLocalPart}@${props.emailDomainName}`,
          },
          permissions: ["ses"],
          timeout,
        },
        finalizeEnrollment: {
          handler: "lambdas/enrollment/finalize-enrollment.handler",
          timeout,
        }
      },
      resolvers: {
        "Query    facilities": "facilities",
        "Query    viewer": "viewer",
        "Query    enrollments": "enrollments",
        "User     facilities": "userFacilities",
        "Mutation requestEnrollment": "requestEnrollment",
        "Mutation finalizeEnrollment": "finalizeEnrollment",
      },
    });

    /**
     * Site
     */
    const siteDomain = props.siteDomainName;
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

    console.log(`Vendor response ${verifyDomainIdentity.toString()}`)

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
