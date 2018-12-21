import React, { Component } from 'react';

import { MutationFn, Mutation } from 'react-apollo';

import { Container, Segment, Menu, Input, Icon } from 'semantic-ui-react';

import WrNavbar from '../WrNavbar';
import WrDeckList from './WrDeckList';
import { DECK_CREATE_MUTATION, DeckCreateData, DeckCreateVariables } from './gqlTypes';

const handleNewDeck = (
  mutate: MutationFn<DeckCreateData, DeckCreateVariables>,
) => () => {
  mutate({
    variables: { name: 'deck1' },
  });
  return null;
};
const createDeckButton = (
  mutate: MutationFn<DeckCreateData, DeckCreateVariables>,
) => (
    <Menu.Item onClick={handleNewDeck(mutate)}>
      <Icon name="plus" /> New Deck
    </Menu.Item>
  );

class DeckView extends Component {
  public readonly render = () => {
    return (
      <div>
        <Segment as="section" vertical={true} basic={true}>
          <Container>
            <WrNavbar dashboardPage="Deck">
              <Mutation mutation={DECK_CREATE_MUTATION}>
                {createDeckButton}
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
            <WrDeckList />
          </Container>
        </Segment>
      </div>
    );
  }
}

export default DeckView;
