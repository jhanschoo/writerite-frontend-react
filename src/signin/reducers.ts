import { ActionTypes, SigninAction } from './actions';
import { OptionalUserAndToken } from './types';

export interface SigninState {
  data: OptionalUserAndToken;
}

export const initialState: SigninState = {
  data: null,
};

export const signin = (
  state: SigninState = initialState, action: SigninAction,
): SigninState => {
  switch (action.type) {
    case ActionTypes.SIGNIN:
      return Object.assign({}, state, {
        data: action.data,
      });
    default:
      return state;
  }
};
