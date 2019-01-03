import { User, MutationType, Payload } from '../types';

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
}

// subscription types

export type WrRoomUpdatesPayload = Payload<WrRoom>;
