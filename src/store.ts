import { createStore, Store } from 'redux';
import { rootReducer } from './reducers';

import { SigninState } from './signin/reducers';

export interface WrState {
  signin?: SigninState;
}

type WrStore = Store<WrState>;

export const store: WrStore = createStore(
  rootReducer,
  // @ts-ignore
  window && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
