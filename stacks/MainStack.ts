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

    const userPoolName = `${scope.stage}-${scope.name}-Users`;
    const userPool = new cognito.UserPool(this, userPoolName, {
      userPoolName,
      selfSignUpEnabled: true,
      userVerification: {
        emailSubject: `Weryfikacja adresu email ${props.siteDomainName}`,
        emailBody:
          "Dziękujemy za rejestrację, potwierdź swój adres email klikając w ten link: {##Verify Email##}",
        emailStyle: cognito.VerificationEmailStyle.LINK,
      },
      signInAliases: {
        username: false,
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
        fullname: {
          required: true,
          mutable: true,
        },
        phoneNumber: {
          required: false,
          mutable: true,
        },
        profilePicture: {
          required: false,
          mutable: true,
        },
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
    });

    const client = userPool.addClient(`${scope.stage}-${scope.name}-Client`)

    const api = new sst.AppSyncApi(this, "AppSyncApi", {
      graphqlApi: {
        schema: "graphql/schema.graphql",
        authorizationConfig: {
          defaultAuthorization: {
            authorizationType: appsync.AuthorizationType.USER_POOL,
            userPoolConfig: {
              userPool: userPool,
            },
          },
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

    const siteDomain = scope.stage === "prod" ? props.siteDomainName : `${scope.stage}.${props.siteDomainName}`
    const site = new sst.ReactStaticSite(this, "ReactSite", {
      path: "site",
      customDomain: {
        domainName: siteDomain,
        domainAlias: `www.${siteDomain}`,
        hostedZone: props.hostedZoneName,
      },
      environment: {
        REACT_APP_GRAPHQL_API_URL: api.graphqlApi.graphqlUrl || api.url,
      }
    });

    this.addOutputs({
      ApiEndpoint: api.graphqlApi.graphqlUrl,
      ApiKey: api.graphqlApi.apiKey || "api key not found",
      UserPoolId: userPool.userPoolId,
      UserPoolClientId: client.userPoolClientId,
      SiteAddress: site.customDomainUrl || site.url,
    });
  }
}
