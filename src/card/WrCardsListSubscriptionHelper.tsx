import { PureComponent } from 'react';
import { SubscribeToMoreOptions } from 'apollo-client';
import { UpdateQueryFn } from 'apollo-client/core/watchQueryOptions';
import { CARD_UPDATES_SUBSCRIPTION, CardsData, CardUpdatesData, CardUpdatesVariables } from './gql';
import { Card } from './types';
import { MutationType } from '../types';


interface SubscriptionProps {
  subscribeToMore: (options: SubscribeToMoreOptions<
    CardsData, CardUpdatesVariables, CardUpdatesData
  >) => () => void;
}

class WrDeckListSubscriptionHelper extends PureComponent<SubscriptionProps> {
  public readonly componentDidMount = () => {
    const updateQuery: UpdateQueryFn<CardsData, CardUpdatesVariables, CardUpdatesData> = (
      prev, { subscriptionData },
    ) => {
      let cards = prev.cardsFromDeck || [];
      const { cardUpdates } = subscriptionData.data;
      switch (cardUpdates.mutation) {
        case MutationType.CREATED:
          cards = cards.concat([cardUpdates.new]);
          break;
        case MutationType.UPDATED:
          cards = cards.map((card: Card) => {
            if (card.id !== cardUpdates.new.id) {
              return card;
            }
            return cardUpdates.new;
          });
          break;
        case MutationType.DELETED:
          cards = cards.filter((card: Card) => {
            return card.id === cardUpdates.oldId;
          });
          break;
      }
      return Object.assign<object, CardsData, CardsData>(
        {}, prev, { cardsFromDeck: cards },
      );
    };
    this.props.subscribeToMore({
      document: CARD_UPDATES_SUBSCRIPTION,
      updateQuery,
    });
  }

  public readonly render = () => null;
}

export default WrDeckListSubscriptionHelper;
