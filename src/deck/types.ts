import { User, Payload } from '../types';

export interface Deck {
  id: string;
  name: string;
  owner: User;
}

export interface DeckDetail extends Deck {
  id: string;
  name: string;
  owner: User;
}

export type DeckUpdatesPayload = Payload<Deck>;
