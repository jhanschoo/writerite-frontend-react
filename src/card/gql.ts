import gql from 'graphql-tag';
import { WrCard, CardUpdatesPayload } from './types';

// Cards query

export const CARDS_QUERY = gql`
query Cards($deckId: ID!) {
  rwCardsOfDeck(deckId: $deckId) {
    id
    front
    back
  }
}
`;

export interface CardsVariables {
  deckId: string;
}

export interface CardsData {
  rwCardsOfDeck: WrCard[] | null;
}

// CardCreate mutation

export const CARD_CREATE_MUTATION = gql`
mutation CardCreate(
  $front: String! $back: String! $deckId: ID!
) {
  rwCardSave(
    front: $front back: $back deckId: $deckId
  ) {
    id
    front
    back
  }
}
`;

export interface CardCreateVariables {
  deckId: string;
  front: string;
  back: string;
}

export interface CardCreateData {
  rwCardSave: WrCard | null;
}

// CardEdit mutation

export const CARD_EDIT_MUTATION = gql`
mutation CardEdit(
  $id: ID! $front: String! $back: String! $deckId: ID!
) {
  rwCardSave(
    id: $id front: $front back: $back deckId: $deckId
  ) {
    id
    front
    back
  }
}
`;

export interface CardEditVariables {
  id: string;
  deckId: string;
  front: string;
  back: string;
}

export interface CardEditData {
  rwCardSave: WrCard | null;
}

// CardDelete mutation

export const CARD_DELETE_MUTATION = gql`
mutation CardDelete($id: ID!) {
  rwCardDelete(id: $id)
}
`;

export interface CardDeleteVariables {
  id: string;
}

export interface CardDeleteData {
  rwCardDelete: string | null;
}

// CardUpdates subscription

export const CARD_UPDATES_SUBSCRIPTION = gql`
subscription CardUpdates($deckId: ID!) {
  rwCardUpdatesOfDeck(deckId: $deckId) {
    mutation
    new {
      id
      front
      back
    }
    oldId
  }
}
`;

export interface CardUpdatesVariables {
  deckId: string;
}

export interface CardUpdatesData {
  rwCardUpdatesOfDeck: CardUpdatesPayload;
}
