interface CognitoUserInfo {
  attributes: {
    sub: string;
    email: string;
    email_verified: boolean;
    name: string;
    address?: string;
    picture?: string;
  };
  username: string;
};

export default CognitoUserInfo;
