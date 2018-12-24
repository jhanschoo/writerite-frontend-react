import React, { Component, PureComponent } from 'react';

import { Link } from 'react-router-dom';

import { Query, QueryResult, Mutation, MutationFn } from 'react-apollo';
import { SubscribeToMoreOptions } from 'apollo-client';
import { UpdateQueryFn } from 'apollo-client/core/watchQueryOptions';

import { Card, Segment, Container, Menu, Input, Icon } from 'semantic-ui-react';

import {
  ROOMS_QUERY, ROOM_CREATE_MUTATION, ROOM_UPDATES_SUBSCRIPTION,
  RoomsData, RoomUpdatesData, RoomCreateData, RoomCreateVariables,
} from './gqlTypes';
import WrNavbar from '../WrNavbar';

interface SubscriptionProps {
  subscribeToMore: (options: SubscribeToMoreOptions) => () => void;
}

class SubscriptionHelper extends PureComponent<SubscriptionProps> {
  public readonly componentDidMount = () => {
    const updateQuery: UpdateQueryFn<RoomsData, {}, RoomUpdatesData> = (
      prev, { subscriptionData },
    ) => {
      const rooms = prev.rooms.slice();
      const { roomUpdates } = subscriptionData.data;
      if (roomUpdates.mutation === 'CREATED') {
        rooms.push(roomUpdates.new);
      }
      prev.rooms = rooms;
      return Object.assign<object, RoomsData, RoomsData>(
        {}, prev, { rooms },
      );
    };
    this.props.subscribeToMore({
      document: ROOM_UPDATES_SUBSCRIPTION,
      updateQuery,
    });
  }

  public readonly render = () => null;
}

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
      <SubscriptionHelper subscribeToMore={subscribeToMore} />
      <Card.Group itemsPerRow={4}>
        {list}
      </Card.Group>
    </>
  );
};

const handleNewRoom = (
  mutate: MutationFn<RoomCreateData, RoomCreateVariables>,
) => () => {
  mutate({
    variables: { name: 'room1' },
  });
  return null;
};

const createRoomButton = (
  mutate: MutationFn<RoomCreateData, RoomCreateVariables>,
) => (
    <Menu.Item onClick={handleNewRoom(mutate)}>
      <Icon name="plus" /> New Room
    </Menu.Item>
  );

// TODO: refactor search to use redux state
// tslint:disable-next-line: max-classes-per-file
class WrRoomList extends Component {
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
                  placeholder="Search for a deck..."
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
