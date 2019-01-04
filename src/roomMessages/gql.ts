import gql from 'graphql-tag';
import {
  WrRoomMessage, WrRoomMessageUpdatesPayload,
} from './types';

// RoomMessages query

export const ROOM_MESSAGES_QUERY = gql`
query RoomMessages($roomId: ID!) {
  rwRoomMessagesOfRoom(roomId: $roomId) {
    id
    content
    sender {
      id
      email
    }
  }
}
`;

export interface RoomMessagesVariables {
  roomId: string;
}

export interface RoomMessagesData {
  rwRoomMessagesOfRoom: WrRoomMessage[] | null;
}

// RoomMessageCreate mutation

export const ROOM_MESSAGE_CREATE = gql`
mutation RoomMessageCreate($roomId: ID! $content: String!) {
  rwRoomMessageCreate(roomId: $roomId content: $content) {
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
  rwRoomMessageCreate: WrRoomMessage | null;
}

// RoomMessageUpdates subscription

export const ROOM_MESSAGE_UPDATES_SUBSCRIPTION = gql`
subscription RoomMessageUpdates($roomId: ID!) {
  rwRoomMessageUpdatesOfRoom(roomId: $roomId) {
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
  rwRoomMessageUpdatesOfRoom: WrRoomMessageUpdatesPayload;
}
