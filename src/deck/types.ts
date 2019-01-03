import { User, Payload } from '../types';

export interface WrDeck {
  id: string;
  name: string;
  owner: User;
}

export interface WrDeckDetail extends WrDeck {
  id: string;
  name: string;
  owner: User;
}

export type WrDeckUpdatesPayload = Payload<WrDeck>;
