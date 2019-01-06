import { createStore, Store } from 'redux';
import { rootReducer } from './reducers';

import { SigninState } from './signin/reducers';
import { DeckState } from './deck/reducers';
import { RoomState } from './room/reducers';
import { CardState } from './card/reducers';

export interface WrState {
  readonly signin?: SigninState;
  readonly deck?: DeckState;
  readonly room?: RoomState;
  readonly card?: CardState;
}

type WrStore = Store<WrState>;

export const store: WrStore = createStore(
  rootReducer,
  // @ts-ignore
  window && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
