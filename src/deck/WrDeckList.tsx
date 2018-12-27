import React, { PureComponent } from 'react';

import { Query, QueryResult, Mutation, MutationFn } from 'react-apollo';
import {
  DECKS_QUERY, DECK_CREATE_MUTATION,
  DecksData, DeckCreateData, DeckCreateVariables,
} from './gqlTypes';
import WrDeckListSubscriptionHelper from './WrDeckListSubscriptionHelper';

import { Segment, Container, Menu, Input, Icon } from 'semantic-ui-react';

import WrNavbar from '../WrNavbar';

const createDeckButton = (
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

const renderListWithSubscription = ({
  subscribeToMore, loading, error, data,
}: QueryResult<DecksData, {}>) => {
  if (loading) {
    return 'Loading...';
  }
  if (error || !data) {
    return `Error! ${error && error.message}`;
  }
  const list = data.decks.map(({ id, name }: { id: string, name: string }) => (
    <p key={id}>{name}</p>
  ));
  return (
    <>
      <WrDeckListSubscriptionHelper subscribeToMore={subscribeToMore} />
      {list}
    </>
  );
};

class WrDeckList extends PureComponent {
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
            <Query query={DECKS_QUERY}>
              {renderListWithSubscription}
            </Query>
          </Container>
        </Segment>
      </div>
    );
  }
}

export default WrDeckList;
