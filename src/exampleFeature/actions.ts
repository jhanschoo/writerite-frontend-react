export enum ActionTypes {
  SET_SIGNIN_TYPE = 'SIGNIN_IS_LOGIN',
}

export enum SigninType {
  NEW_SIGNIN = 'NEW_SIGNIN',
  LOGIN = 'LOGIN',
}

// Action creators

export interface SigninTypeAction {
  type: ActionTypes.SET_SIGNIN_TYPE;
  signinType: SigninType;
}

export const setSigninType = (signinType: SigninType): SigninTypeAction => {
  return {
    type: ActionTypes.SET_SIGNIN_TYPE,
    signinType,
  };
};
