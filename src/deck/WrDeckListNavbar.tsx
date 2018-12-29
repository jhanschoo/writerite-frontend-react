import React, { PureComponent } from 'react';

import { Mutation, MutationFn } from 'react-apollo';
import {
  DECK_CREATE_MUTATION, DeckCreateVariables, DeckCreateData,
} from './gql';
import { printApolloError } from '../util';

import { Segment, Container, Menu, Input, Icon } from 'semantic-ui-react';

import WrNavbar from '../WrNavbar';

const renderCreateDeck = (
  mutate: MutationFn<DeckCreateData, DeckCreateVariables>,
) => {
  const handleNewDeck = () => mutate({
    variables: { name: 'deck1' },
  });
  return (
    <Menu.Item onClick={handleNewDeck}>
      <Icon name="plus" /> New Deck
    </Menu.Item>
  );
};

class WrDeckListNavbar extends PureComponent {

  public readonly render = () => {
    return (
      <Segment as="section" vertical={true} basic={true}>
        <Container>
          <WrNavbar dashboardPage="Decks">
            <Mutation<DeckCreateData, DeckCreateVariables>
              mutation={DECK_CREATE_MUTATION}
              onError={printApolloError}
            >
              {renderCreateDeck}
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
    );
  }
}

export default WrDeckListNavbar;
