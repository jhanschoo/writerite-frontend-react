import React, { PureComponent } from 'react';

import { Segment, Container, Feed, Card, Placeholder } from 'semantic-ui-react';

import { withRouter, RouteComponentProps } from 'react-router';

import { Query, QueryResult } from 'react-apollo';
import { ROOM_QUERY, RoomData, RoomVariables } from './gqlTypes';

import { connect } from 'react-redux';
import { WrState } from '../store';
import { CurrentUser } from '../signin/actions';

import WrNavbar from '../WrNavbar';
import WrRoomMessageInput from './WrRoomMessageInput';
import './WrRoomDetail.css';
import WrRoomFeed from './WrRoomFeed';

type RoomDetailRouteProps = RouteComponentProps<{ roomId: string }>;

type OwnProps = RoomDetailRouteProps;

type DispatchProps = object;

interface StateProps {
  readonly user: CurrentUser | null;
}

type Props = StateProps & DispatchProps & OwnProps;

class WrRoomDetail extends PureComponent<Props> {

  public readonly render = () => {
    const { match } = this.props;
    const { roomId } = match.params;
    const { renderRoom } = this;
    return (
      <Query query={ROOM_QUERY} variables={{ roomId }}>
        {renderRoom}
      </Query>
    );
  }

  private renderRoom = ({
    subscribeToMore, loading, error, data,
  }: QueryResult<RoomData, RoomVariables>) => {
    const { name, occupants, owner } = (data && data.room) || {
      name: null,
      occupants: null,
      owner: null,
    };
    const occupantEmails = occupants
      && occupants.map(({ email }) => email).sort().join(', ');
    const formattedOccupantEmails = occupantEmails
      && <Card.Meta>Also in this room: {occupantEmails}</Card.Meta>;
    const formattedRoomName = name || 'Loading...';
    const formattedOwnerInfo = (owner)
      ? `Hosted by: ${owner.email}`
      : <Placeholder><Placeholder.Line length="short" /></Placeholder>;
    const formattedError = error
      && <Card.Content>Error: {error.message}</Card.Content>;
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
                <Card.Header>{formattedRoomName}</Card.Header>
                <Card.Meta>{formattedOwnerInfo}</Card.Meta>
                {formattedOccupantEmails}
              </Card.Content>
              {formattedError}
              <WrRoomFeed />
              <WrRoomMessageInput />
            </Card>
          </Container>
        </Segment>
      </>
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
