import { OptionalUserAndToken } from './types';

export enum ActionTypes {
  SIGNIN = 'SIGNIN',
}

export interface SigninAction {
  readonly type: ActionTypes.SIGNIN;
  readonly data: OptionalUserAndToken;
}

export const createSignin = (data: OptionalUserAndToken): SigninAction => {
  return {
    type: ActionTypes.SIGNIN,
    data,
  };
};

export const createSignout = (): SigninAction => {
  return {
    type: ActionTypes.SIGNIN,
    data: null,
  };
};
