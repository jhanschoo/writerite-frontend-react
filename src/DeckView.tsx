import React, { Component } from 'react';

import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';

import { MutationFn, OperationVariables, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { Container, Segment, Menu, Input, Button, Form, Icon } from 'semantic-ui-react';

import WrNavbar from './WrNavbar';
import WrDeckList from './WrDeckList';

const DECK_CREATE = gql`
mutation DeckCreate($name: String!) {
  deckSave(name: $name) {
    id
    name
  }
}
`;

const handleNewDeck = (
  mutate: MutationFn<any, OperationVariables>,
) => () => {
  mutate({
    variables: { name: 'deck1' },
  });
  return null;
};
const createDeckButton = (
  mutate: MutationFn<any, OperationVariables>,
) => (
    <Menu.Item onClick={handleNewDeck(mutate)}>
      <Icon name="plus" /> New Deck
    </Menu.Item>
  );

class DeckView extends Component<RouteComponentProps<any>> {
  public readonly render = () => {
    return (
      <div>
        <Segment as="section" vertical={true} basic={true}>
          <Container>
            <WrNavbar dashboardPage="Deck">
              <Mutation mutation={DECK_CREATE}>
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

export default connect()(DeckView);
