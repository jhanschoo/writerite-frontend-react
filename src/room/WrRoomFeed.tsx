import React, { PureComponent } from 'react';

import { SubscribeToMoreOptions } from 'apollo-client';

import { Feed, Card, Placeholder } from 'semantic-ui-react';

import { withRouter, RouteComponentProps } from 'react-router';

import { Query, QueryResult } from 'react-apollo';
import {
  ROOM_MESSAGES_QUERY, ROOM_MESSAGE_UPDATES_SUBSCRIPTION,
  RoomVariables, RoomMessage, RoomMessagesData, RoomMessageUpdatesData,
} from './gqlTypes';

import { emailToGravatarLink } from '../util';
import { UpdateQueryFn } from 'apollo-client/core/watchQueryOptions';

type RoomDetailRouteProps = RouteComponentProps<{ roomId: string }>;

type OwnProps = RoomDetailRouteProps;

type DispatchProps = object;

type StateProps = object;

type Props = StateProps & DispatchProps & OwnProps;

interface SubscriptionProps {
  subscribeToMore: (options: SubscribeToMoreOptions<
    RoomMessagesData, { roomId: string }, RoomMessageUpdatesData
  >) => () => void;
}

const formattedLoadingFeed = [
  (
    <Feed.Event key="placeholder0">
      <Feed.Content>
        <Placeholder>
          <Placeholder.Header image={true}>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
        </Placeholder>
      </Feed.Content>
    </Feed.Event>
  ), (
    <Feed.Event key="placeholder1">
    <Feed.Content>
      <Placeholder>
        <Placeholder.Header image={true}>
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Header>
      </Placeholder>
    </Feed.Content>
    </Feed.Event>
  ),
];

class SubscriptionHelper extends PureComponent<
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

// tslint:disable-next-line: variable-name
const WrappedSubscriptionHelper = withRouter(SubscriptionHelper);

// tslint:disable-next-line: max-classes-per-file
class WrRoomFeed extends PureComponent<Props> {
  public readonly render = () => {
    const { match } = this.props;
    const { roomId } = match.params;
    const { renderFeed } = this;
    return (
      <Query query={ROOM_MESSAGES_QUERY} variables={{ roomId }}>
        {renderFeed}
      </Query>
    );
  }

  private renderFeed = ({
    subscribeToMore, loading, error, data,
  }: QueryResult<RoomMessagesData, RoomVariables>) => {
    const formattedMessages = (loading || !data)
      ? formattedLoadingFeed
      : data.room.messages.map(({ id, content, sender }) => {
        const formattedLabel = sender && (
          <Feed.Label>
            <img
              src={emailToGravatarLink(sender.email)}
              alt={`Gravatar of ${sender.email}`}
            />
          </Feed.Label>
        );
        const formattedSender = sender && (
          <Feed.Summary>
            {sender.email}
          </Feed.Summary>
        );
        return (
          <Feed.Event key={id}>
            {formattedLabel}
            <Feed.Content>
              {formattedSender}
              <Feed.Extra text={true}>
                {content}
              </Feed.Extra>
            </Feed.Content>
          </Feed.Event>
        );
      });
    return (
      <>
        <WrappedSubscriptionHelper subscribeToMore={subscribeToMore} />
        <Card.Content className="room-content">
          <Feed>
            {formattedMessages}
          </Feed>
        </Card.Content>
      </>
    );
  }
}

export default withRouter<OwnProps>(WrRoomFeed);
