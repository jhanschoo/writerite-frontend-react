import { PureComponent } from 'react';
import { SubscribeToMoreOptions } from 'apollo-client';
import { UpdateQueryFn } from 'apollo-client/core/watchQueryOptions';
import { DECK_UPDATES_SUBSCRIPTION, DecksData, DeckUpdatesData, DeckUpdatesVariables } from './gql';
import { printApolloError } from '../util';


interface Props {
  subscribeToMore: (options: SubscribeToMoreOptions<
    DecksData, DeckUpdatesVariables, DeckUpdatesData
  >) => () => void;
}

class WrDeckListSubscriptionHelper extends PureComponent<Props> {
  public readonly componentDidMount = () => {
    const { subscribeToMore } = this.props;
    const updateQuery: UpdateQueryFn<DecksData, DeckUpdatesVariables, DeckUpdatesData> = (
      prev, { subscriptionData },
    ) => {
      const rwDecks = prev.rwDecks ? prev.rwDecks.slice() : [];
      const { rwDeckUpdates } = subscriptionData.data;
      if (rwDeckUpdates.mutation === 'CREATED') {
        rwDecks.push(rwDeckUpdates.new);
      }
      return Object.assign<object, DecksData, DecksData>(
        {}, prev, { rwDecks },
      );
    };
    subscribeToMore({
      document: DECK_UPDATES_SUBSCRIPTION,
      updateQuery,
      onError: printApolloError,
    });
  }

  public readonly render = () => null;
}

export default WrDeckListSubscriptionHelper;
