import * as sst from "@serverless-stack/resources";
import * as cdk from "aws-cdk-lib";
import { aws_cognito as cognito } from "aws-cdk-lib";
import * as appsync from "@aws-cdk/aws-appsync-alpha";

export interface MainStackProps extends sst.StackProps {
  hostedZoneName: string;
  siteDomainName: string;
}

export default class MainStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props: MainStackProps) {
    super(scope, id, props);

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

    const api = new sst.AppSyncApi(this, "AppSyncApi", {
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
        facilities: "lambdas/src/main.handler",
      },
      resolvers: {
        "Query    facilities": "facilities",
      },
    });

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
        REACT_APP_USERPOOL_ID: auth.cognitoUserPool?.userPoolId || "none",
        REACT_APP_USERPOOL_CLIENT_ID:
          auth.cognitoUserPoolClient?.userPoolClientId || "none",
      },
    });

    this.addOutputs({
      ApiEndpoint: api.graphqlApi.graphqlUrl,
      ApiKey: api.graphqlApi.apiKey || "api key not found",
      SiteAddress: site.customDomainUrl || site.url,
    });
  }
}
