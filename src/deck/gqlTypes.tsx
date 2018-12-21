import gql from 'graphql-tag';

export interface Deck {
  id: string;
  name: string;
}

export const DECKS_QUERY = gql`
query Decks {
  decks {
    id
    name
  }
}
`;

export interface DecksData {
  decks: Deck[];
}

export const DECK_CREATE_MUTATION = gql`
mutation DeckCreate($name: String!) {
  deckSave(name: $name) {
    id
    name
  }
}
`;

export interface DeckCreateData {
  deckSave: Deck;
}

export interface DeckCreateVariables {
  name: string;
}

export const DECK_UPDATES_SUBSCRIPTION = gql`
subscription DeckUpdates {
  deckUpdates {
    mutation
    new {
      id
      name
    }
  }
}
`;

interface DeckCreated {
  mutation: 'CREATED';
  new: Deck;
}

export type DeckUpdatesPayload = DeckCreated;

export interface DeckUpdatesData {
  deckUpdates: DeckUpdatesPayload;
}
