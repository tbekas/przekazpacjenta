import React from "react";
import { Amplify } from "aws-amplify";
import {
  AmplifyProvider,
  Authenticator,
  Button,
  Flex,
  Text,
  View,
} from "@aws-amplify/ui-react";
import aws_exports from "./aws-exports";

import "@aws-amplify/ui-react/styles.css";
import theme from "./theme";

Amplify.configure(aws_exports);

console.log(aws_exports)

const App = () => {
  return (
    <AmplifyProvider theme={theme}>
      <Authenticator 
        loginMechanisms={['email']}
        signUpAttributes={['name']}
        >
        {({ signOut, user }) => (
          <Flex
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            alignContent="flex-start"
            wrap="nowrap"
            gap="1rem"
            textAlign="center"
          >
          

            {user && (
              <View width="100%">
                <Text>Hello {user.attributes?.name}</Text>
                <Button onClick={signOut}>
                  <Text>Sign Out</Text>
                </Button>
              </View>
            )}
          </Flex>
        )}
      </Authenticator>
    </AmplifyProvider>
  );
};

export default App;