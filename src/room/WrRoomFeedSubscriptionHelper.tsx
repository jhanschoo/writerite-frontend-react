import { ROOM_MESSAGE_UPDATES_SUBSCRIPTION, RoomMessagesData, RoomMessageUpdatesData } from './gqlTypes';
import { withRouter, RouteComponentProps } from 'react-router';
import { PureComponent } from 'react';
import { SubscribeToMoreOptions } from 'apollo-client';
import { UpdateQueryFn } from 'apollo-client/core/watchQueryOptions';

type RoomDetailRouteProps = RouteComponentProps<{ roomId: string }>;

interface SubscriptionProps {
  subscribeToMore: (options: SubscribeToMoreOptions<
    RoomMessagesData, { roomId: string }, RoomMessageUpdatesData
  >) => () => void;
}

class WrRoomFeedSubscriptionHelper extends PureComponent<
SubscriptionProps & RoomDetailRouteProps
> {
public readonly componentDidMount = () => {
  const { match, subscribeToMore } = this.props;
  const { roomId } = match.params;
  const updateQuery: UpdateQueryFn<
    RoomMessagesData, { roomId: string }, RoomMessageUpdatesData
  > = (
    prev, { subscriptionData },
  ) => {
    const messages = prev.room.messages.slice();
    const { roomMessageUpdatesOfRoom } = subscriptionData.data;
    if (roomMessageUpdatesOfRoom.mutation === 'CREATED') {
      messages.push(roomMessageUpdatesOfRoom.new);
    }
    return Object.assign(
      {}, prev, { room: Object.assign({}, prev.room, { messages }) },
    );
  };

  subscribeToMore({
    document: ROOM_MESSAGE_UPDATES_SUBSCRIPTION,
    variables: { roomId },
    updateQuery,
  });
}

public readonly render = () => null;
}

export default withRouter(WrRoomFeedSubscriptionHelper);
