import { OptionalSigninData, ActionTypes, SigninAction } from './actions';

export interface SigninState {
  data: OptionalSigninData;
}

export const initialState: SigninState = {
  data: null,
};

export const signin = (state: SigninState = initialState, action: SigninAction): SigninState => {
  switch (action.type) {
    case ActionTypes.SIGNIN:
      return Object.assign({}, state, {
        data: action.data,
      });
    default:
      return state;
  }
};
