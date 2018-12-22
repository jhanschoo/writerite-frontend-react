import React, { Component } from 'react';

import { SubscribeToMoreOptions } from 'apollo-client';

import { Segment, Container, Feed, Card } from 'semantic-ui-react';

import WrNavbar from '../WrNavbar';
import { withRouter, RouteComponentProps } from 'react-router';

import './WrRoomDetail.css';
import { Query, QueryResult } from 'react-apollo';
import { ROOM_QUERY, RoomData, RoomVariables } from './gqlTypes';
import { connect } from 'react-redux';
import { WrState } from '../store';
import { CurrentUser } from '../signin/actions';

type RoomDetailRouteProps = RouteComponentProps<{ roomId: string }>;

type OwnProps = RoomDetailRouteProps;

type DispatchProps = object;

interface StateProps {
  readonly user: CurrentUser | null;
}

const renderRoom = ({
  subscribeToMore, loading, error, data,
}: QueryResult<RoomData, RoomVariables>) => {
  if (loading) {
    return 'Loading...';
  }
  if (error || !data) {
    return `Error! ${error && error.message}`;
  }
  const { name, occupants, owner } = data.room;
  const occupantEmails = occupants.map(({ email }) => email).sort().join(', ');
  const formattedOccupantEmails = occupantEmails
    && <Card.Meta>Also in this room: {occupantEmails}</Card.Meta>;
  return (
    <>
      <Segment as="section" vertical={true} basic={true}>
        <Container>
          <WrNavbar dashboardPage="Room" />
        </Container>
      </Segment>
      <Segment as="section" vertical={true} basic={true}>
        <Container>
          <Card fluid={true}>
            <Card.Content>
              <Card.Header>{name}</Card.Header>
              <Card.Meta>Hosted by: {owner.email}</Card.Meta>
              {formattedOccupantEmails}
            </Card.Content>
            <Card.Content className="room-content">
              <Feed />
            </Card.Content>
            <Card.Content>
              Dumb shit
            </Card.Content>
          </Card>
        </Container>
      </Segment>
    </>
  );
};

const formatData = ({ user, message, id }: any) => (
  <Feed.Event key={id}>
    <Feed.Content>
      <Feed.Summary>
        {user}
      </Feed.Summary>
      <Feed.Extra text={true}>
        {message}
      </Feed.Extra>
    </Feed.Content>
  </Feed.Event>
);

class WrRoomDetail extends Component<RoomDetailRouteProps> {
  public readonly render = () => {
    const { match } = this.props;
    const { roomId } = match.params;
    return (
      <Query query={ROOM_QUERY} variables={{ roomId }}>
        {renderRoom}
      </Query>
    );
  }
}

const mapStateToProps = (state: WrState): StateProps => {
  const user = (state.signin && state.signin.data && state.signin.data.user) || null;
  return { user };
};

export default withRouter<OwnProps>(
  connect<StateProps, {}, OwnProps>(mapStateToProps)(WrRoomDetail),
);
