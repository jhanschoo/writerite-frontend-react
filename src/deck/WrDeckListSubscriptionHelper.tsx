import { PureComponent } from 'react';
import { SubscribeToMoreOptions } from 'apollo-client';
import { UpdateQueryFn } from 'apollo-client/core/watchQueryOptions';
import { DECK_UPDATES_SUBSCRIPTION, DecksData, DeckUpdatesData } from './gqlTypes';


interface SubscriptionProps {
  subscribeToMore: (options: SubscribeToMoreOptions) => () => void;
}

class WrDeckListSubscriptionHelper extends PureComponent<SubscriptionProps> {
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

export default WrDeckListSubscriptionHelper;
