import { combineReducers } from 'redux';
import { signin } from './signin/reducers';

export const rootReducer = combineReducers({
  signin,
});
