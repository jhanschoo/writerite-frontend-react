export enum ActionTypes {
  SIGNIN = 'SIGNIN',
}

interface SigninData {
  token: string;
  user: {
    email: string,
    id: string,
    roles: string[],
  };
}

export type OptionalSigninData = SigninData | null;

export interface SigninAction {
  type: ActionTypes.SIGNIN;
  data: OptionalSigninData;
}

export const createSignin = (data: OptionalSigninData): SigninAction => {
  return {
    type: ActionTypes.SIGNIN,
    data,
  };
};
