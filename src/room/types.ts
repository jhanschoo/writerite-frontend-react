import { User, MutationType, Payload } from '../types';

export interface Room {
  id: string;
  name: string;
  owner: User;
}

export interface RoomDetail extends Room {
  id: string;
  name: string;
  owner: User;
  occupants: User[];
}

export interface RoomMessages extends Room {
  id: string;
  name: string;
  messages: RoomMessage[];
}

export interface RoomMessage {
  id: string;
  content: string;
  sender?: User;
}

// subscription types

export type RoomUpdatesPayload = Payload<Room>;

export type RoomMessageUpdatesPayload = Payload<RoomMessage>;
