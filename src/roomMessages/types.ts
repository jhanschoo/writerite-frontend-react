import { User, Payload } from '../types';

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

export interface WrRoomMessages extends WrRoom {
  id: string;
  name: string;
  messages: WrRoomMessage[];
}

export interface WrRoomMessage {
  id: string;
  content: string;
  sender?: User;
}

// subscription types

export type WrRoomUpdatesPayload = Payload<WrRoom>;

export type WrRoomMessageUpdatesPayload = Payload<WrRoomMessage>;
