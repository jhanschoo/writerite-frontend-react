import React, { PureComponent } from 'react';

import { Link } from 'react-router-dom';

import { Query, QueryResult, Mutation, MutationFn } from 'react-apollo';
import {
  ROOMS_QUERY, ROOM_CREATE_MUTATION,
 RoomsData, RoomCreateData, RoomCreateVariables,
} from './gqlTypes';
import WrRoomListSubscriptionHelper from './WrRoomListSubscriptionHelper';

import { Card, Segment, Container, Menu, Input, Icon } from 'semantic-ui-react';

import WrNavbar from '../WrNavbar';

const renderListWithSubscription = ({
  subscribeToMore, loading, error, data,
}: QueryResult<RoomsData, {}>) => {
  if (loading) {
    return 'Loading...';
  }
  if (error || !data) {
    return `Error! ${error && error.message}`;
  }
  const list = data.rooms.map(({ id, name }: { id: string, name: string }) => (
    <Card key={id} as={Link} from="/dashboard/room" to={`/dashboard/room/${id}`}>
      <Card.Content>
        <Card.Header>
          {name}
        </Card.Header>
      </Card.Content>
    </Card>
  ));
  return (
    <>
      <WrRoomListSubscriptionHelper subscribeToMore={subscribeToMore} />
      <Card.Group itemsPerRow={4}>
        {list}
      </Card.Group>
    </>
  );
};

const createRoomButton = (
  mutate: MutationFn<RoomCreateData, RoomCreateVariables>,
) => {
  const handleNewRoom = () => mutate({
    variables: { name: 'room1' },
  });
  return (
    <Menu.Item onClick={handleNewRoom}>
      <Icon name="plus" /> New Room
    </Menu.Item>
  );
};
// TODO: implement and refactor search to use redux state
class WrRoomList extends PureComponent {
  public readonly render = () => {
    return (
      <div>
        <Segment as="section" vertical={true} basic={true}>
          <Container>
            <WrNavbar dashboardPage="Room">
              <Mutation mutation={ROOM_CREATE_MUTATION}>
                {createRoomButton}
              </Mutation>
              <Menu.Item>
                <Input
                  transparent={true}
                  icon="search"
                  iconPosition="left"
                  placeholder="Search for a room..."
                />
              </Menu.Item>
            </WrNavbar>
          </Container>
        </Segment>
        <Segment as="section" vertical={true} basic={true}>
          <Container>
            <Query query={ROOMS_QUERY}>
              {renderListWithSubscription}
            </Query>
          </Container>
        </Segment>
      </div>
    );
  }
}

export default WrRoomList;
