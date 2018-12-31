import React, { PureComponent } from 'react';

import { Segment, Container, Menu, Input, Icon } from 'semantic-ui-react';

import WrNavbar from '../WrNavbar';

class WrRoomListNavbar extends PureComponent {

  public readonly render = () => {
    return (
      <Segment as="section" vertical={true} basic={true}>
        <Container>
          <WrNavbar dashboardPage="Rooms">
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
