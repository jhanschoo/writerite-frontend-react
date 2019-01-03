import { User, Payload } from '../types';

export interface WrCard {
  id: string;
  front: string;
  back: string;
}

export type CardUpdatesPayload = Payload<WrCard>;
