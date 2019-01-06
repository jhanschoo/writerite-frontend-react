import React, { PureComponent } from 'react';

import { Link } from 'react-router-dom';

import { Query, QueryResult } from 'react-apollo';
import { WrDeck } from './types';
import { DECKS_QUERY, DecksData, DecksVariables } from './gql';
import WrDeckListSubscriptionHelper from './WrDeckListSubscriptionHelper';

import { Segment, Container, Card, Placeholder } from 'semantic-ui-react';

import WrDeckListNavbar from './WrDeckListNavbar';
import { printApolloError } from '../util';
import WrDeckCreate from './WrDeckCreate';
import { connect } from 'react-redux';
import { WrState } from '../store';
import { initialState } from './reducers';
import WrDeckItem from './WrDeckItem';

interface StateProps {
  readonly filter: string;
}

class WrDeckList extends PureComponent<StateProps> {

  public readonly render = () => {
    return (
      <>
        <WrDeckListNavbar />
        <Segment as="section" vertical={true} basic={true}>
          <Container>
            <Query<DecksData, DecksVariables>
              query={DECKS_QUERY}
              onError={printApolloError}
            >
              {this.renderList}
            </Query>
          </Container>
        </Segment>
      </>
    );
  }

  private readonly renderList = ({
    subscribeToMore, loading, error, data,
  }: QueryResult<DecksData, DecksVariables>) => {
    const { filter } = this.props;
    if (error) {
      return null;
    }
    if (!loading && (!data || !data.rwDecks)) {
      return null;
    }
    const list = (loading || !data || !data.rwDecks)
      ? (
        <Card key="deck-list-placeholder-0">
          <Card.Content>
            <Card.Header>
              <Placeholder><Placeholder.Line /></Placeholder>
            </Card.Header>
            <Card.Meta>
              <Placeholder><Placeholder.Line /></Placeholder>
            </Card.Meta>
          </Card.Content>
        </Card>
      )
      : data.rwDecks.filter((deck) => {
          return filter === '' || deck.name.includes(filter);
        }).map((deck: WrDeck) => (
        <WrDeckItem key={deck.id} deck={deck} />
      ));
    return (
      <>
        <WrDeckListSubscriptionHelper subscribeToMore={subscribeToMore} />
        <Card.Group itemsPerRow={3}>
          {list}
          <WrDeckCreate />
        </Card.Group>
      </>
    );
  }
}

const mapStateToProps = (state: WrState): StateProps => {
  const { filter } = (state.deck) || initialState;
  return { filter };
};

export default connect(mapStateToProps)(WrDeckList);
