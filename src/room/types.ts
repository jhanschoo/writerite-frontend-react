import { User, Payload } from '../types';
import { WrDeck } from '../deck/types';

export interface WrRoom {
  id: string;
  name: string;
  owner: User;
}

export interface WrRoomDetail extends WrRoom {
  id: string;
  name: string;
  owner: User;
  occupants: User[];
  servingDeck?: WrDeck;
}

// subscription types

export type WrRoomUpdatesPayload = Payload<WrRoom>;
