import { User, Payload } from '../types';

export interface Card {
  id: string;
  front: string;
  back: string;
}

export type CardUpdatesPayload = Payload<Card>;
