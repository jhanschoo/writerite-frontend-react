import { createStore, Store } from 'redux';
import { rootReducer } from './reducers';

export type WrState = object;

type WrStore = Store<WrState>;

export const store: WrStore = createStore(
  rootReducer,
  // @ts-ignore
  window && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
