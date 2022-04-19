import { Auth } from '@aws-amplify/auth';
import CognitoUserInfo from './CognitoUserInfo';

export async function getCurrentUserInfo(): Promise<CognitoUserInfo> {
  return await Auth.currentAuthenticatedUser();
}

export async function signOut(): Promise<void> {
  return await Auth.signOut();
}
