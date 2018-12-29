import React, { PureComponent } from 'react';

import { Link } from 'react-router-dom';

import { Query, QueryResult } from 'react-apollo';
import { Deck } from './types';
import { DECKS_QUERY, DecksData, DecksVariables } from './gql';
import WrDeckListSubscriptionHelper from './WrDeckListSubscriptionHelper';

import { Segment, Container, Card, Placeholder } from 'semantic-ui-react';

import WrDeckListNavbar from './WrDeckListNavbar';
import { printApolloError } from '../util';

const renderList = ({
  subscribeToMore, loading, error, data,
}: QueryResult<DecksData, DecksVariables>) => {
  if (error) {
    return null;
  }
  if (!loading && (!data || !data.decks)) {
    return null;
  }
  const list = (loading || !data || !data.decks)
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
    : data.decks.map(({ id, name, owner: { email } }: Deck) => (
      <Card key={id} as={Link} from="/dashboard/deck" to={`/dashboard/deck/${id}`}>
        <Card.Content>
          <Card.Header>
            {name}
          </Card.Header>
          <Card.Meta>
            by {email}
          </Card.Meta>
        </Card.Content>
      </Card>
    ));
  return (
    <>
      <WrDeckListSubscriptionHelper subscribeToMore={subscribeToMore} />
      <Card.Group itemsPerRow={4}>
        {list}
      </Card.Group>
    </>
  );
};

class WrDeckList extends PureComponent {
  public readonly render = () => {
    return (
      <div>
        <WrDeckListNavbar />
        <Segment as="section" vertical={true} basic={true}>
          <Container>
            <Query<DecksData, DecksVariables>
              query={DECKS_QUERY}
              onError={printApolloError}
            >
              {renderList}
            </Query>
          </Container>
        </Segment>
      </div>
    );
  }
}

export default WrDeckList;
