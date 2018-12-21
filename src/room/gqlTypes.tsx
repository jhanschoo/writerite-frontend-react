import gql from 'graphql-tag';

export interface Room {
  id: string;
  name: string;
}

export const DECKS_QUERY = gql`
query Rooms {
  rooms {
    id
    name
  }
}
`;

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
