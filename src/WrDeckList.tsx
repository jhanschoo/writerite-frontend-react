import React, { Component, PureComponent } from 'react';

import { Query, QueryResult, OperationVariables } from 'react-apollo';
import gql from 'graphql-tag';
import { SubscribeToMoreOptions } from 'apollo-client';

interface DeckResult {
  id: string;
  name: string;
}

interface DecksResult {
  decks: DeckResult[];
}

interface DeckCreated {
  mutation: 'CREATED';
  new: DeckResult;
}

type DeckUpdatesPayload = DeckCreated;

interface DeckUpdatesData {
  deckUpdates: DeckUpdatesPayload;
}

const DECKS = gql`
query Decks {
  decks {
    id
    name
  }
}
`;

const DECK_UPDATES = gql`
subscription DeckUpdates {
  deckUpdates {
    mutation
    new {
      id
      name
    }
  }
}
`;

interface DeckListProps {
  subscribeToMore: (options: SubscribeToMoreOptions) => () => void;
}

class SubscriptionHelper extends PureComponent<DeckListProps> {
  public readonly componentDidMount = () => {
    this.props.subscribeToMore({
      document: DECK_UPDATES,
      updateQuery: (prev: DecksResult, { subscriptionData }: {
        subscriptionData?: {
          data?: DeckUpdatesData,
        },
      }) => {
        if (!(subscriptionData
          && subscriptionData.data
          && subscriptionData.data.deckUpdates)) {
          return prev;
        }
        const decks = prev.decks.slice();
        const { deckUpdates } = subscriptionData.data;
        if (deckUpdates.mutation === 'CREATED') {
          decks.push(deckUpdates.new);
        }
        return Object.assign<object, DecksResult, DecksResult>(
          {}, prev, { decks },
        );
      },
    });
  }

  public readonly render = () => null;
}

const renderListWithSubscription = ({
  subscribeToMore, loading, error, data,
}: QueryResult<any, OperationVariables>) => {
  if (loading) {
    return 'Loading...';
  }
  if (error) {
    return `Error! ${error.message}`;
  }
  const list = data.decks.map(({ id, name }: { id: string, name: string }) => (
    <p key={id}>{name}</p>
  ));
  return (
    <>
      <SubscriptionHelper subscribeToMore={subscribeToMore} />
      {list}
    </>);
};

// tslint:disable-next-line: max-classes-per-file
class WrDeckList extends Component {
  public readonly render = () => {
    return (
      <Query query={DECKS}>
        {renderListWithSubscription}
      </Query>
    );
  }
}

export default WrDeckList;
