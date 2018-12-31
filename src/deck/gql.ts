import gql from 'graphql-tag';
import { Deck, DeckUpdatesPayload } from './types';

// Deck query

export const DECK_QUERY = gql`
query Deck($deckId: ID!) {
  deck(id: $deckId) {
    id
    name
    owner {
      id
      email
    }
  }
}
`;

export interface DeckVariables {
  deckId: string;
}

export interface DeckData {
  deck: Deck | null;
}

// Decks query

export const DECKS_QUERY = gql`
query Decks {
  decks {
    id
    name
    owner {
      id
      email
    }
  }
}
`;

export type DecksVariables = object;

export interface DecksData {
  decks: Deck[] | null;
}

// DeckCreate mutation

export const DECK_CREATE_MUTATION = gql`
mutation DeckCreate($name: String!) {
  deckSave(name: $name) {
    id
    name
  }
}
`;

export interface DeckCreateVariables {
  name: string;
}

export interface DeckCreateData {
  deckSave: Deck | null;
}

// DeckUpdates subscription

export const DECK_UPDATES_SUBSCRIPTION = gql`
subscription DeckUpdates {
  deckUpdates {
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

export type DeckUpdatesVariables = object;

export interface DeckUpdatesData {
  deckUpdates: DeckUpdatesPayload;
}
