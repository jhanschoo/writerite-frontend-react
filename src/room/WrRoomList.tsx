import React, { PureComponent } from 'react';

import { Link } from 'react-router-dom';

import { Query, QueryResult } from 'react-apollo';
import { WrRoom } from './types';
import { ROOMS_QUERY, RoomsData, RoomsVariables } from './gql';
import WrRoomListSubscriptionHelper from './WrRoomListSubscriptionHelper';

import { Card, Segment, Container, Placeholder } from 'semantic-ui-react';

import WrRoomListNavbar from './WrRoomListNavbar';
import { printApolloError } from '../util';
import WrNewRoom from './NewWrRoom';

const renderList = ({
  subscribeToMore, loading, error, data,
}: QueryResult<RoomsData, RoomsVariables>) => {
  if (error) {
    return null;
  }
  if (!loading && (!data || !data.rwRooms)) {
    return null;
  }
  // additional ||'s are needed due to tsc's poor case analysis
  const list = (loading || !data || !data.rwRooms)
    ? (
      <Card key="room-list-placeholder-0">
        <Card.Content>
          <Card.Header>
            <Placeholder><Placeholder.Line /></Placeholder>
          </Card.Header>
          <Card.Meta>
            <Placeholder><Placeholder.Line /></Placeholder>
          </Card.Meta>
        </Card.Content>
      </Card>
    )
    : data.rwRooms.map(({ id, name, owner: { email } }: WrRoom) => (
      <Card key={id} as={Link} from="/dashboard/room" to={`/dashboard/room/${id}`}>
        <Card.Content>
          <Card.Header>
            {name}
          </Card.Header>
          <Card.Meta>
            hosted by {email}
          </Card.Meta>
        </Card.Content>
      </Card>
    ));
  return (
    <>
      <WrRoomListSubscriptionHelper subscribeToMore={subscribeToMore} />
      <Card.Group itemsPerRow={4}>
        {list}
        <WrNewRoom />
      </Card.Group>
    </>
  );
};
// TODO: implement and refactor search to use redux state
class WrRoomList extends PureComponent {
  public readonly render = () => {
    return (
      <>
        <WrRoomListNavbar />
        <Segment as="section" vertical={true} basic={true}>
          <Container>
            <Query<RoomsData, RoomsVariables>
              query={ROOMS_QUERY}
              onError={printApolloError}
            >
              {renderList}
            </Query>
          </Container>
        </Segment>
      </>
    );
  }
}

export default WrRoomList;
