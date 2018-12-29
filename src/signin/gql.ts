import gql from 'graphql-tag';
import { UserAndToken, OptionalUserAndToken } from './types';

// Signin

export const SIGNIN = gql`
mutation Signin(
  $email: String! $token: String! $authorizer: String! $identifier: String!
  ) {
  signin(
    email: $email
    token: $token
    authorizer: $authorizer
    identifier: $identifier
    persist: false
  ) {
    user {
      id
      email
      roles
    }
    token
  }
}
`;

export interface SigninVariables {
  email: string;
  token: string;
  authorizer: 'GOOGLE' | 'FACEBOOK' | 'LOCAL';
  identifier: string;
}

export interface SigninData {
  signin: OptionalUserAndToken;
}

