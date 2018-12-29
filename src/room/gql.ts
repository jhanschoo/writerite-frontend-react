import gql from 'graphql-tag';
import {
  RoomDetail, Room, RoomMessages, RoomUpdatesPayload, RoomMessage,
  RoomMessageUpdatesPayload,
} from './types';

// Room query

export const ROOM_QUERY = gql`
query Room($roomId: ID!) {
  room(id: $roomId) {
    id
    name
    owner {
      id
      email
    }
    occupants {
      id
      email
    }
  }
}
`;

export interface RoomVariables {
  roomId: string;
}

export interface RoomData {
  room: RoomDetail | null;
}

// Rooms query

export const ROOMS_QUERY = gql`
query Rooms {
  rooms {
    id
    name
    owner {
      id
      email
    }
  }
}
`;

export type RoomsVariables = object;

export interface RoomsData {
  rooms: Room[] | null;
}

// RoomMessages query

export const ROOM_MESSAGES_QUERY = gql`
query RoomMessages($roomId: ID!) {
  room(id: $roomId) {
    id
    name
    messages {
      id
      content
      sender {
        id
        email
      }
    }
  }
}
`;

export interface RoomMessagesVariables {
  roomId: string;
}

export interface RoomMessagesData {
  room: RoomMessages | null;
}

// RoomCreate mutation

export const ROOM_CREATE_MUTATION = gql`
mutation RoomCreate($name: String!) {
  roomCreate(name: $name) {
    id
    name
  }
}
`;

export interface RoomCreateVariables {
  name: string;
}

export interface RoomCreateData {
  roomCreate: Room | null;
}

// RoomMessageCreate mutation

export const ROOM_MESSAGE_CREATE = gql`
mutation RoomMessageCreate($roomId: ID! $content: String!) {
  roomMessageCreate(roomId: $roomId messageContent: $content) {
    id
    content
  }
}
`;

export interface RoomMessageCreateVariables {
  roomId: string;
  content: string;
}

export interface RoomMessageCreateData {
  roomMessageCreate: RoomMessage | null;
}

// RoomUpdatesSubscription

export const ROOM_UPDATES_SUBSCRIPTION = gql`
subscription RoomUpdates {
  roomUpdates {
    mutation
    new {
      id
      name
      owner {
        id
        email
      }
    }
  }
}
`;

export type RoomUpdatesVariables = object;

export interface RoomUpdatesData {
  roomUpdates: RoomUpdatesPayload;
}

// RoomMessageUpdates subscription

export const ROOM_MESSAGE_UPDATES_SUBSCRIPTION = gql`
subscription RoomMessageUpdates($roomId: ID!) {
  roomMessageUpdatesOfRoom(id: $roomId) {
    mutation
    new {
      id
      content
      sender {
        id
        email
      }
    }
  }
}
`;

export interface RoomMessageUpdatesVariables {
  roomId: string;
}

export interface RoomMessageUpdatesData {
  roomMessageUpdatesOfRoom: RoomMessageUpdatesPayload;
}
