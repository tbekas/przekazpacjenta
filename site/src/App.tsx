import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { AmplifyProvider, Authenticator } from '@aws-amplify/ui-react';
import theme from './theme';
import aws_exports from './aws-exports';

import '@aws-amplify/ui-react/styles.css';
import Layout from './components/layout';

Amplify.configure(aws_exports);

console.log(aws_exports);

const App = () => {
  return (
    <AmplifyProvider theme={theme}>
      <Authenticator loginMechanisms={['email']} signUpAttributes={['name']}>
        {({ user }) =>
          user && (
            <>
              <BrowserRouter>
                <Layout></Layout>
              </BrowserRouter>
            </>
          )
        }
      </Authenticator>
    </AmplifyProvider>
  );
};

export default App;
