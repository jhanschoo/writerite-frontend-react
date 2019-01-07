import gql from 'graphql-tag';
import { WrDeck, WrDeckUpdatesPayload } from './types';

// Deck query

export const DECK_QUERY = gql`
query Deck($deckId: ID!) {
  rwDeck(id: $deckId) {
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
  rwDeck: WrDeck | null;
}

// Decks query

export const DECKS_QUERY = gql`
query Decks {
  rwDecks {
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
  rwDecks: WrDeck[] | null;
}

// DeckCreate mutation

export const DECK_CREATE_MUTATION = gql`
mutation DeckCreate($name: String) {
  rwDeckSave(name: $name) {
    id
    name
  }
}
`;

export interface DeckCreateVariables {
  name?: string;
}

export interface DeckCreateData {
  rwDeckSave: WrDeck | null;
}

// DeckUpdate mutation

export const DECK_UPDATE_MUTATION = gql`
mutation DeckUpdate($id: ID! $name: String!) {
  rwDeckSave(id: $id name: $name) {
    id
    name
  }
}
`;

export interface DeckUpdateVariables {
  id: string;
  name: string;
}

export interface DeckUpdateData {
  rwDeckSave: WrDeck | null;
}

// DeckDelete mutation

export const DECK_DELETE_MUTATION = gql`
mutation DeckDelete($id: ID!) {
  rwDeckDelete(id: $id)
}
`;

export interface DeckDeleteVariables {
  id: string;
}

export interface DeckDeleteData {
  rwDeckDelete: string | null;
}

// DeckUpdates subscription

export const DECK_UPDATES_SUBSCRIPTION = gql`
subscription DeckUpdates {
  rwDeckUpdates {
    mutation
    new {
      id
      name
      owner {
        id
        email
      }
    }
    oldId
  }
}
`;

export type DeckUpdatesVariables = object;

export interface DeckUpdatesData {
  rwDeckUpdates: WrDeckUpdatesPayload;
}
