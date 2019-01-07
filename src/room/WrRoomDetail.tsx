import React, { PureComponent } from 'react';

import { Segment, Container, Placeholder, Header, Grid } from 'semantic-ui-react';

import { RouteComponentProps } from 'react-router';

import { Query, QueryResult } from 'react-apollo';
import { ROOM_QUERY, RoomData, RoomVariables } from './gql';
import { printApolloError } from '../util';

import WrNavbar from '../WrNavbar';
import WrRoomMessageInput from '../roomMessages/WrRoomMessageInput';
import WrRoomFeed from '../roomMessages/WrRoomFeed';
import { DecksData, DecksVariables, DECKS_QUERY } from '../deck/gql';
import WrRoomDetailDeckSelector from './WrRoomDetailDeckSelector';

type RoomDetailRouteProps = RouteComponentProps<{ roomId: string }>;

type Props = RoomDetailRouteProps;

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
              fetchPolicy="network-only"
              onError={printApolloError}
            >
              {renderRoom}
            </Query>
          </Container>
        </Segment>
      </>
    );
  }

  private readonly renderRoom = ({
    loading, error, data, refetch,
  }: QueryResult<RoomData, RoomVariables>) => {
    const { roomId } = this.props.match.params;
    if (error) {
      return null;
    }
    if (!loading && (!data || !data.rwRoom)) {
      return null;
    }
    const formattedHeader = (data && data.rwRoom)
      ? (() => {
        const { name, occupants, owner } = data.rwRoom;
        const formattedOwnerInfo = (
          <Header.Subheader>{owner.email} is hosting</Header.Subheader>
        );
        const occupantEmails = occupants.map(({ email }) => email).sort().join(', ');
        const formattedOccupantEmails = occupantEmails && (
          <Header.Subheader>Also in this room: {occupantEmails}</Header.Subheader>
        );
        return (
          <Segment>
            <Grid>
              <Grid.Column width={8}>
                <Header as="h3">
                  {name}
                  {formattedOwnerInfo}
                  {formattedOccupantEmails}
                </Header>
              </Grid.Column>
              <Grid.Column width={4} textAlign="right">
                <WrRoomDetailDeckSelector
                  roomId={roomId}
                  currentDeck={data.rwRoom.servingDeck}
                  onMutation={refetch}
                  loading={loading}
                />
              </Grid.Column>
            </Grid>
          </Segment>
        );
      })()
      : (
        <Segment>
          <Placeholder>
            <Placeholder.Header>
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Header>
          </Placeholder>
        </Segment>
      );
    return (
      <Segment.Group>
        {formattedHeader}
        <WrRoomFeed roomId={roomId} />
        <WrRoomMessageInput roomId={roomId} />
      </Segment.Group>
    );
  }
}

export default WrRoomDetail;
