import { PureComponent } from 'react';
import { SubscribeToMoreOptions } from 'apollo-client';
import { UpdateQueryFn } from 'apollo-client/core/watchQueryOptions';

import {
  ROOM_UPDATES_SUBSCRIPTION,
  RoomsData, RoomUpdatesData, RoomUpdatesVariables,
} from './gql';
import { MutationType } from '../types';
import { printApolloError } from '../util';


interface SubscriptionProps {
  subscribeToMore: (options: SubscribeToMoreOptions<RoomsData, RoomUpdatesVariables, RoomUpdatesData>) => () => void;
}

class WrRoomListSubscriptionHelper extends PureComponent<SubscriptionProps> {
  public readonly componentDidMount = () => {
    const updateQuery: UpdateQueryFn<
      RoomsData, RoomUpdatesVariables, RoomUpdatesData
    > = (prev, { subscriptionData }) => {
      const rooms = (prev && prev.rooms && prev.rooms.slice()) || [];
      const { roomUpdates } = subscriptionData.data;
      if (roomUpdates.mutation === MutationType.CREATED) {
        rooms.push(roomUpdates.new);
      }
      // TODO: Handle other mutation types
      prev.rooms = rooms;
      return Object.assign<object, RoomsData, RoomsData>(
        {}, prev, { rooms },
      );
    };
    this.props.subscribeToMore({
      document: ROOM_UPDATES_SUBSCRIPTION,
      updateQuery,
      onError: printApolloError,
    });
  }

  public readonly render = () => null;
}

export default WrRoomListSubscriptionHelper;
