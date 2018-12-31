import gql from 'graphql-tag';
import { Card, CardUpdatesPayload } from './types';

// Cards query

export const CARDS_QUERY = gql`
query Cards($deckId: ID!) {
  cardsFromDeck(id: $deckId) {
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
  cardsFromDeck: Card[] | null;
}

// CardCreate mutation

export const CARD_CREATE_MUTATION = gql`
mutation CardCreate(
  $front: String! $back: String! $deckId: ID!
) {
  cardSave(
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
  cardSave: Card | null;
}

// CardEdit mutation

export const CARD_EDIT_MUTATION = gql`
mutation CardEdit(
  $id: ID! $front: String! $back: String! $deckId: ID!
) {
  cardSave(
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
  cardSave: Card | null;
}

// CardUpdates subscription

export const CARD_UPDATES_SUBSCRIPTION = gql`
subscription CardUpdates($deckId: ID!) {
  cardUpdatesOfDeck(deckId: $deckId) {
    mutation
    new {
      id
      front
      back
    }
  }
}
`;

export interface CardUpdatesVariables {
  deckId: string;
}

export interface CardUpdatesData {
  cardUpdates: CardUpdatesPayload;
}
