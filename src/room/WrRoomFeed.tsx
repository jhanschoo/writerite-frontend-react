import React, { Component, createRef } from 'react';

import { withRouter, RouteComponentProps } from 'react-router';

import { Query, QueryResult } from 'react-apollo';
import {
  ROOM_MESSAGES_QUERY, RoomVariables, RoomMessagesData, RoomMessagesVariables,
} from './gql';
import WrRoomFeedSubscriptionHelper from './WrRoomFeedSubscriptionHelper';

import { Card, Comment, Placeholder, Ref, Visibility } from 'semantic-ui-react';
import { emailToGravatarLink, printApolloError } from '../util';

type RoomDetailRouteProps = RouteComponentProps<{ roomId: string }>;

type OwnProps = RoomDetailRouteProps;

type Props = OwnProps;

interface State {
  pinToBottom: boolean;
}

const formattedLoadingFeed = [
  (
    <Comment key="room-feed-placeholder-0">
      <Comment.Content>
        <Placeholder>
          <Placeholder.Header image={true}>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
        </Placeholder>
      </Comment.Content>
    </Comment>
  ), (
    <Comment key="room-feed-placeholder-1">
      <Comment.Content>
        <Placeholder>
          <Placeholder.Header image={true}>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
        </Placeholder>
      </Comment.Content>
    </Comment>
  ),
];

class WrRoomFeed extends Component<Props, State> {
  public state = {
    pinToBottom: true,
  };

  private feedRef = createRef<HTMLDivElement>();

  public readonly render = () => {
    const { roomId } = this.props.match.params;
    const { feedRef, renderComments, scrollFeedToBottom } = this;
    return (
      <Ref innerRef={feedRef}>
        <Card.Content className="room-content">
          <Query<RoomMessagesData, RoomMessagesVariables>
            query={ROOM_MESSAGES_QUERY}
            variables={{ roomId }}
            onCompleted={scrollFeedToBottom}
            onError={printApolloError}
          >
            {renderComments}
          </Query>
        </Card.Content>
      </Ref>
    );
  }

  private readonly scrollFeedToBottom = () => {
    if (!this.feedRef.current || !this.state.pinToBottom) {
      return;
    }
    const list = this.feedRef.current;
    list.scrollTop = list.scrollHeight - list.clientHeight;
  }

  private readonly setPinToBottom = () => {
    return this.setState({ pinToBottom: true });
  }

  private readonly unsetPinToBottom = () => {
    return this.setState({ pinToBottom: false });
  }

  private readonly renderComments = ({
    subscribeToMore, loading, error, data,
  }: QueryResult<RoomMessagesData, RoomVariables>) => {
    if (error) {
      return null;
    }
    if (!loading && (!data || !data.room)) {
      return null;
    }
    const { setPinToBottom, unsetPinToBottom } = this;
    const formattedMessages = (loading || !data || !data.room)
      ? formattedLoadingFeed
      : data.room.messages.map(({ id, content, sender }) => {
        const formattedLabel = !sender
          ? null
          : (
            <Comment.Avatar
              src={emailToGravatarLink(sender.email)}
              alt={`Gravatar of ${sender.email}`}
            />
          );
        const formattedSender = !sender
          ? null
          : (<Comment.Author>{sender.email}</Comment.Author>);
        return (
          <Comment key={id}>
            {formattedLabel}
            <Comment.Content>
              {formattedSender}
              <Comment.Text>
                {content}
              </Comment.Text>
            </Comment.Content>
          </Comment>
        );
      });
    return (
      <>
        <WrRoomFeedSubscriptionHelper subscribeToMore={subscribeToMore} />
        <Visibility
          once={false}
          onBottomVisible={setPinToBottom}
          onBottomVisibleReverse={unsetPinToBottom}
        >
          <Comment.Group>
            {formattedMessages}
          </Comment.Group>
        </Visibility>
      </>
    );
  }
}

export default withRouter<OwnProps>(WrRoomFeed);
