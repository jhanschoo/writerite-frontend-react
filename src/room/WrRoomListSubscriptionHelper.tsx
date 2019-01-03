import { PureComponent } from 'react';
import { SubscribeToMoreOptions } from 'apollo-client';
import { UpdateQueryFn } from 'apollo-client/core/watchQueryOptions';

import {
  ROOM_UPDATES_SUBSCRIPTION,
  RoomsData, RoomUpdatesData, RoomUpdatesVariables,
} from './gql';
import { MutationType } from '../types';
import { printApolloError } from '../util';


interface Props {
  subscribeToMore: (options: SubscribeToMoreOptions<RoomsData, RoomUpdatesVariables, RoomUpdatesData>) => () => void;
}

class WrRoomListSubscriptionHelper extends PureComponent<Props> {
  public readonly componentDidMount = () => {
    const { subscribeToMore } = this.props;
    const updateQuery: UpdateQueryFn<
      RoomsData, RoomUpdatesVariables, RoomUpdatesData
    > = (prev, { subscriptionData }) => {
      const rwRooms = (prev && prev.rwRooms && prev.rwRooms.slice()) || [];
      const { rwRoomUpdates } = subscriptionData.data;
      if (rwRoomUpdates.mutation === MutationType.CREATED) {
        rwRooms.push(rwRoomUpdates.new);
      }
      // TODO: Handle other mutation types
      prev.rwRooms = rwRooms;
      return Object.assign<object, RoomsData, RoomsData>(
        {}, prev, { rwRooms },
      );
    };
    subscribeToMore({
      document: ROOM_UPDATES_SUBSCRIPTION,
      updateQuery,
      onError: printApolloError,
    });
  }

  public readonly render = () => null;
}

export default WrRoomListSubscriptionHelper;
