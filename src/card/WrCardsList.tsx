import React, { Component } from 'react';

import { Query, QueryResult } from 'react-apollo';
import {
  CARDS_QUERY, CardsData, CardsVariables,
} from './gql';
import { printApolloError } from '../util';

import { Card, Placeholder, Grid, Button } from 'semantic-ui-react';
import WrCardCreate from './WrCardCreate';
import { Card as CardType } from './types';
import WrCardItem from './WrCardItem';

interface OwnProps {
  deckId: string;
}
type Props = OwnProps;

const formattedLoadingCards = (
  <Card key="card-list-placeholder-0">
    <Card.Content>
      <Grid divided={true}>
        <Grid.Row>
          <Grid.Column width={6}>
            <Placeholder>
              <Placeholder.Line />
            </Placeholder>
          </Grid.Column>
          <Grid.Column width={6}>
            <Placeholder>
              <Placeholder.Line />
            </Placeholder>
          </Grid.Column>
          <Grid.Column width={4}>
            <Placeholder>
              <Placeholder.Line />
            </Placeholder>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Card.Content>
  </Card>
);

class WrCardsList extends Component<Props> {

  public readonly render = () => {
    const { deckId } = this.props;
    const { renderComments } = this;
    return (
      <Query<CardsData, CardsVariables>
        query={CARDS_QUERY}
        variables={{ deckId }}
        onError={printApolloError}
      >
        {renderComments}
      </Query>
    );
  }

  private readonly renderComments = ({
    subscribeToMore, loading, error, data,
  }: QueryResult<CardsData, CardsVariables>) => {
    if (error) {
      return null;
    }
    if (!loading && (!data || !data.cardsFromDeck)) {
      return null;
    }
    const { deckId } = this.props;
    const formattedMessages = (loading || !data || !data.cardsFromDeck)
      ? formattedLoadingCards
      : data.cardsFromDeck.map(({ id, front, back }: CardType) => {
        return <WrCardItem key={id} id={id} front={front} back={back} deckId={deckId} />;
      });
    return (
      <>
        {/*<WrCardsListSubscriptionHelper subscribeToMore={subscribeToMore} />*/}
        <Card.Content>
          <Card.Group itemsPerRow={1}>
            {formattedMessages}
            <WrCardCreate deckId={deckId} />
          </Card.Group>
        </Card.Content>
      </>
    );
  }
}

export default WrCardsList;
