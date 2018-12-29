import React, { PureComponent } from 'react';

import { Mutation, MutationFn } from 'react-apollo';
import { ROOM_CREATE_MUTATION, RoomCreateData, RoomCreateVariables } from './gql';

import { Segment, Container, Menu, Input, Icon } from 'semantic-ui-react';

import WrNavbar from '../WrNavbar';
import { printApolloError } from '../util';

const renderCreateRoom = (
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

class WrRoomListNavbar extends PureComponent {

  public readonly render = () => {
    return (
      <Segment as="section" vertical={true} basic={true}>
        <Container>
          <WrNavbar dashboardPage="Rooms">
            <Mutation<RoomCreateData, RoomCreateVariables>
              mutation={ROOM_CREATE_MUTATION}
              onError={printApolloError}
            >
              {renderCreateRoom}
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
    );
  }
}

export default WrRoomListNavbar;
