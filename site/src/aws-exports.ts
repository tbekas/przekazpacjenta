const awsExports = {
  aws_appsync_graphqlEndpoint: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  aws_appsync_region: process.env.REACT_APP_REGION,
  aws_cognito_region: process.env.REACT_APP_REGION,
  aws_user_pools_id: process.env.REACT_APP_USERPOOL_ID,
  aws_user_pools_web_client_id: process.env.REACT_APP_USERPOOL_CLIENT_ID,
}

export default awsExports;
