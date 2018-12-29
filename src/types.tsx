export interface User {
  id: string;
  email: string;
}

export enum MutationType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
}

export interface Created<T> {
  mutation: MutationType.CREATED;
  new: T;
}

export interface Updated<T> {
  mutation: MutationType.UPDATED;
  new: T;
}

export interface Deleted {
  mutation: MutationType.DELETED;
  oldId: string;
}

export type Payload<T> =
  | Created<T>
  | Updated<T>
  | Deleted
  ;
