import React, { PureComponent } from 'react';

import { Segment, Container, Menu, Input } from 'semantic-ui-react';

import WrNavbar from '../WrNavbar';

class WrDeckListNavbar extends PureComponent {

  public readonly render = () => {
    return (
      <Segment as="section" vertical={true} basic={true}>
        <Container>
          <WrNavbar dashboardPage="Decks">
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
    );
  }
}

export default WrDeckListNavbar;
