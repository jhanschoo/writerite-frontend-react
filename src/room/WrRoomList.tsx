import React, { Component, PureComponent } from 'react';

import { Query, QueryResult, OperationVariables } from 'react-apollo';
import { SubscribeToMoreOptions } from 'apollo-client';
import { UpdateQueryFn } from 'apollo-client/core/watchQueryOptions';

import {
  ROOM_UPDATES_SUBSCRIPTION, DECKS_QUERY, RoomsData, RoomUpdatesData,
} from './gqlTypes';

interface RoomListProps {
  subscribeToMore: (options: SubscribeToMoreOptions) => () => void;
}

class SubscriptionHelper extends PureComponent<RoomListProps> {
  public readonly componentDidMount = () => {
    const updateQuery: UpdateQueryFn<RoomsData, {}, RoomUpdatesData> = (
      prev, { subscriptionData },
    ) => {
      const rooms = prev.rooms.slice();
      const { roomUpdates } = subscriptionData.data;
      if (roomUpdates.mutation === 'CREATED') {
        rooms.push(roomUpdates.new);
      }
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

const renderListWithSubscription = ({
  subscribeToMore, loading, error, data,
}: QueryResult<RoomsData, {}>) => {
  if (loading) {
    return 'Loading...';
  }
  if (error || !data) {
    return `Error! ${error && error.message}`;
  }
  const list = data.rooms.map(({ id, name }: { id: string, name: string }) => (
    <p key={id}>{name}</p>
  ));
  return (
    <>
      <SubscriptionHelper subscribeToMore={subscribeToMore} />
      {list}
    </>
  );
};

// tslint:disable-next-line: max-classes-per-file
class WrRoomList extends Component {
  public readonly render = () => {
    return (
      <Query query={DECKS_QUERY}>
        {renderListWithSubscription}
      </Query>
    );
  }
}

export default WrRoomList;
