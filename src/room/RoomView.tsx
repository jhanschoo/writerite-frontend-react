import React, { Component } from 'react';

import { MutationFn, Mutation } from 'react-apollo';

import { Container, Segment, Menu, Input, Icon } from 'semantic-ui-react';

import WrNavbar from '../WrNavbar';
import WrRoomList from './WrRoomList';
import { ROOM_CREATE_MUTATION, RoomCreateData, RoomCreateVariables } from './gqlTypes';

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

class RoomView extends Component {
  public readonly render = () => {
    return (
      <div>
        <Segment as="section" vertical={true} basic={true}>
          <Container>
            <WrNavbar dashboardPage="Deck">
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
            <WrRoomList />
          </Container>
        </Segment>
      </div>
    );
  }
}

export default RoomView;
