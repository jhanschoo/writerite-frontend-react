import gql from 'graphql-tag';
import { CurrentUser } from '../signin/actions';

export interface User {
  id: string;
  email: string;
}

export interface Room {
  id: string;
  name: string;
}

export interface RoomDetail extends Room {
  id: string;
  name: string;
  owner: CurrentUser;
  occupants: CurrentUser[];
}

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

export const ROOMS_QUERY = gql`
query Rooms {
  rooms {
    id
    name
  }
}
`;

export interface RoomVariables {
  roomId: string;
}

export interface RoomData {
  room: RoomDetail;
}

export interface RoomsData {
  rooms: Room[];
}

export const ROOM_CREATE_MUTATION = gql`
mutation RoomCreate($name: String!) {
  roomCreate(name: $name) {
    id
    name
  }
}
`;

export interface RoomCreateData {
  roomCreate: Room;
}

export interface RoomCreateVariables {
  name: string;
}

export const ROOM_UPDATES_SUBSCRIPTION = gql`
subscription RoomUpdates {
  roomUpdates {
    mutation
    new {
      id
      name
    }
  }
}
`;

interface RoomCreated {
  mutation: 'CREATED';
  new: Room;
}

export type RoomUpdatesPayload = RoomCreated;

export interface RoomUpdatesData {
  roomUpdates: RoomUpdatesPayload;
}

// Room Message

export const ROOM_MESSAGE_CREATE = gql`
mutation RoomMessageCreate($roomId: ID! $content: String!) {
  roomMessageCreate(roomId: $roomId messageContent: $content) {
    id
    content
  }
}
`;
