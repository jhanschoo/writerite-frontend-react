export enum ActionTypes {
  SIGNIN = 'SIGNIN',
}

export interface User {
  readonly email: string;
  readonly id: string;
  readonly roles: string[];
}

interface SigninData {
  readonly token: string;
  readonly user: User;
}

export type OptionalSigninData = SigninData | null;

export interface SigninAction {
  readonly type: ActionTypes.SIGNIN;
  readonly data: OptionalSigninData;
}

export const createSignin = (data: OptionalSigninData): SigninAction => {
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
