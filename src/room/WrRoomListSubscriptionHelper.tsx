import { PureComponent } from 'react';
import { SubscribeToMoreOptions } from 'apollo-client';
import { UpdateQueryFn } from 'apollo-client/core/watchQueryOptions';

import { ROOM_UPDATES_SUBSCRIPTION, RoomsData, RoomUpdatesData } from './gqlTypes';


interface SubscriptionProps {
  subscribeToMore: (options: SubscribeToMoreOptions) => () => void;
}

class WrRoomListSubscriptionHelper extends PureComponent<SubscriptionProps> {
  public readonly componentDidMount = () => {
    const updateQuery: UpdateQueryFn<RoomsData, {}, RoomUpdatesData> = (
      prev, { subscriptionData },
    ) => {
      const rooms = prev.rooms.slice();
      const { roomUpdates } = subscriptionData.data;
      if (roomUpdates.mutation === 'CREATED') {
        rooms.push(roomUpdates.new);
      }
      prev.rooms = rooms;
      return Object.assign<object, RoomsData, RoomsData>(
        {}, prev, { rooms },
      );
    };
    this.props.subscribeToMore({
      document: ROOM_UPDATES_SUBSCRIPTION,
      updateQuery,
    });
  }

  public readonly render = () => null;
}

export default WrRoomListSubscriptionHelper;
