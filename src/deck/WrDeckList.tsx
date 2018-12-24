import React, { Component, PureComponent } from 'react';

import { Query, QueryResult, OperationVariables } from 'react-apollo';
import { SubscribeToMoreOptions } from 'apollo-client';
import { UpdateQueryFn } from 'apollo-client/core/watchQueryOptions';

import {
  DECK_UPDATES_SUBSCRIPTION, DECKS_QUERY, DecksData, DeckUpdatesData,
} from './gqlTypes';

interface SubscriptionProps {
  subscribeToMore: (options: SubscribeToMoreOptions) => () => void;
}

class SubscriptionHelper extends PureComponent<SubscriptionProps> {
  public readonly componentDidMount = () => {
    const updateQuery: UpdateQueryFn<DecksData, {}, DeckUpdatesData> = (
      prev, { subscriptionData },
    ) => {
      const decks = prev.decks.slice();
      const { deckUpdates } = subscriptionData.data;
      if (deckUpdates.mutation === 'CREATED') {
        decks.push(deckUpdates.new);
      }
      return Object.assign<object, DecksData, DecksData>(
        {}, prev, { decks },
      );
    };
    this.props.subscribeToMore({
      document: DECK_UPDATES_SUBSCRIPTION,
      updateQuery,
    });
  }

  public readonly render = () => null;
}

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
      <SubscriptionHelper subscribeToMore={subscribeToMore} />
      {list}
    </>
  );
};

// tslint:disable-next-line: max-classes-per-file
class WrDeckList extends Component {
  public readonly render = () => {
    return (
      <Query query={DECKS_QUERY}>
        {renderListWithSubscription}
      </Query>
    );
  }
}

export default WrDeckList;
