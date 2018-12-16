import { SigninType, ActionTypes, SigninTypeAction } from './actions';

export interface SigninState {
  signinType: SigninType;
}

export const initialState: SigninState = {
  signinType: SigninType.NEW_SIGNIN,
};

export const signin = (state: SigninState = initialState, action: SigninTypeAction): SigninState => {
  switch (action.type) {
    case ActionTypes.SET_SIGNIN_TYPE:
      return Object.assign({}, state, {
        signinType: action.signinType,
      });
    default:
      return state;
  }
};
