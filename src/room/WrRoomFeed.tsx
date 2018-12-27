import React, { Component, createRef } from 'react';

import { withRouter, RouteComponentProps } from 'react-router';

import { Query, QueryResult } from 'react-apollo';
import {
  ROOM_MESSAGES_QUERY, RoomVariables, RoomMessagesData,
} from './gqlTypes';
import WrRoomFeedSubscriptionHelper from './WrRoomFeedSubscriptionHelper';

import { Feed, Card, Placeholder, Ref, Button, Visibility, VisibilityEventData } from 'semantic-ui-react';
import { emailToGravatarLink } from '../util';


type RoomDetailRouteProps = RouteComponentProps<{ roomId: string }>;

type OwnProps = RoomDetailRouteProps;

type DispatchProps = object;

type StateProps = object;

type Props = StateProps & DispatchProps & OwnProps;

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

class WrRoomFeed extends Component<Props, { pinToBottom: boolean }> {
  public state = {
    pinToBottom: true,
  };

  private feedRef = createRef<HTMLDivElement>();

  public readonly render = () => {
    const { roomId } = this.props.match.params;
    const { renderFeed, scrollFeedToBottom } = this;
    return (
      <Query
        query={ROOM_MESSAGES_QUERY}
        variables={{ roomId }}
        onCompleted={scrollFeedToBottom}
      >
        {renderFeed}
      </Query>
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

  private readonly renderFeed = ({
    subscribeToMore, loading, error, data,
  }: QueryResult<RoomMessagesData, RoomVariables>) => {
    const { feedRef, setPinToBottom, unsetPinToBottom } = this;
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
        <WrRoomFeedSubscriptionHelper subscribeToMore={subscribeToMore} />
        <Ref innerRef={feedRef}>
          <Card.Content className="room-content">
            <Visibility
              once={false}
              onBottomVisible={setPinToBottom}
              onBottomVisibleReverse={unsetPinToBottom}
            >
              <Feed>
                  {formattedMessages}
              </Feed>
            </Visibility>
          </Card.Content>
        </Ref>
      </>
    );
  }
}

export default withRouter<OwnProps>(WrRoomFeed);
