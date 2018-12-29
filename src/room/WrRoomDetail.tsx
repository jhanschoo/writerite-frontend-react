import React, { PureComponent } from 'react';

import { Segment, Container, Card, Placeholder } from 'semantic-ui-react';
import './WrRoomDetail.css';

import { withRouter, RouteComponentProps } from 'react-router';

import { Query, QueryResult } from 'react-apollo';
import { ROOM_QUERY, RoomData, RoomVariables } from './gql';
import { printApolloError } from '../util';

import WrNavbar from '../WrNavbar';
import WrRoomMessageInput from './WrRoomMessageInput';
import WrRoomFeed from './WrRoomFeed';

type RoomDetailRouteProps = RouteComponentProps<{ roomId: string }>;

type OwnProps = RoomDetailRouteProps;

type Props = OwnProps;

class WrRoomDetail extends PureComponent<Props> {

  public readonly render = () => {
    const { match } = this.props;
    const { roomId } = match.params;
    const { renderRoom } = this;
    return (
      <>
        <Segment as="section" vertical={true} basic={true}>
          <Container>
            <WrNavbar dashboardPage="Room" />
          </Container>
        </Segment>
        <Segment as="section" vertical={true} basic={true}>
          <Container>
            <Query<RoomData, RoomVariables>
              query={ROOM_QUERY}
              variables={{ roomId }}
              onError={printApolloError}
            >
              {renderRoom}
            </Query>
          </Container>
        </Segment>
      </>
    );
  }

  private renderRoom = ({
    loading, error, data,
  }: QueryResult<RoomData, RoomVariables>) => {
    if (error) {
      return null;
    }
    if (!loading && (!data || !data.room)) {
      return null;
    }
    const { name, occupants, owner } = (data && data.room) || {
      name: null,
      occupants: null,
      owner: null,
    };
    const occupantEmails = (loading || !occupants)
      ? null
      : occupants.map(({ email }) => email).sort().join(', ');
    const formattedOccupantEmails = (loading || !occupantEmails)
      ? null
      : (<Card.Meta>Also in this room: {occupantEmails}</Card.Meta>);
    const formattedRoomName = (loading || !name)
      ? (
        <Card.Header><Placeholder><Placeholder.Line /></Placeholder></Card.Header>
      )
      : (<Card.Header>{name}</Card.Header>);
    const formattedOwnerInfo = (loading || !owner)
      ? (
        <Card.Meta>
          <Placeholder><Placeholder.Line length="short" /></Placeholder>
        </Card.Meta>
      )
      : (<Card.Meta>{owner.email} is hosting</Card.Meta>);
    return (
      <Card fluid={true}>
        <Card.Content>
          {formattedRoomName}
          <Card.Meta>{formattedOwnerInfo}</Card.Meta>
          {formattedOccupantEmails}
        </Card.Content>
        <WrRoomFeed />
        <WrRoomMessageInput />
      </Card>
    );
  }
}

export default withRouter<OwnProps>(WrRoomDetail);
