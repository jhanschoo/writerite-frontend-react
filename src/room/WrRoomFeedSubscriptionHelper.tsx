import { PureComponent } from 'react';

import { withRouter, RouteComponentProps } from 'react-router';

import { SubscribeToMoreOptions } from 'apollo-client';
import { UpdateQueryFn } from 'apollo-client/core/watchQueryOptions';
import {
  ROOM_MESSAGE_UPDATES_SUBSCRIPTION,
  RoomMessagesData, RoomMessageUpdatesData, RoomMessageUpdatesVariables,
} from './gql';
import { printApolloError } from '../util';
import { MutationType } from '../types';

type RoomDetailRouteProps = RouteComponentProps<{ roomId: string }>;

interface SubscriptionProps {
  subscribeToMore: (options: SubscribeToMoreOptions<
    RoomMessagesData, RoomMessageUpdatesVariables, RoomMessageUpdatesData
  >) => () => void;
}

type Props = SubscriptionProps & RoomDetailRouteProps;

class WrRoomFeedSubscriptionHelper extends PureComponent<Props> {
  public readonly componentDidMount = () => {
    const { match, subscribeToMore } = this.props;
    const { roomId } = match.params;
    const updateQuery: UpdateQueryFn<
      RoomMessagesData, RoomMessageUpdatesVariables, RoomMessageUpdatesData
    > = (prev, { subscriptionData }) => {
      const messages = (prev && prev.room && prev.room.messages.slice()) || [];
      const { roomMessageUpdatesOfRoom } = subscriptionData.data;
      if (roomMessageUpdatesOfRoom.mutation === MutationType.CREATED) {
        messages.push(roomMessageUpdatesOfRoom.new);
      }
      // TODO: handle other types of updates
      return Object.assign(
        {}, prev, { room: Object.assign({}, prev.room, { messages }) },
      );
    };

    subscribeToMore({
      document: ROOM_MESSAGE_UPDATES_SUBSCRIPTION,
      variables: { roomId },
      updateQuery,
      onError: printApolloError,
    });
  }

  public readonly render = () => null;
}

export default withRouter(WrRoomFeedSubscriptionHelper);
