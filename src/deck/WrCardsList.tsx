import React, { Component } from 'react';

import { withRouter, RouteComponentProps } from 'react-router';

import { Query, QueryResult } from 'react-apollo';
import {
  CARDS_QUERY, CardsData, CardsVariables,
} from './gql';
import { printApolloError } from '../util';

import { Card, Placeholder, Grid } from 'semantic-ui-react';
import WrNewCard from './WrNewCard';
import { Card as WrCard } from './types';

type DeckDetailRouteProps = RouteComponentProps<{ deckId: string }>;

type OwnProps = DeckDetailRouteProps;
type DispatchProps = object;
type StateProps = object;
type Props = StateProps & DispatchProps & OwnProps;

const formattedLoadingCards = [
  (
    <Card key="card-list-placeholder-0">
      <Card.Content>
        <Grid columns={2} divided={true}>
          <Grid.Row>
            <Grid.Column>
              <Placeholder>
                <Placeholder.Line />
              </Placeholder>
            </Grid.Column>
            <Grid.Column>
              <Placeholder>
                <Placeholder.Line />
              </Placeholder>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Content>
    </Card>
  ), (
    <Card key="card-list-placeholder-1">
      <Card.Content>
        <Grid columns={2} divided={true}>
          <Grid.Row>
            <Grid.Column>
              <Placeholder>
                <Placeholder.Line />
              </Placeholder>
            </Grid.Column>
            <Grid.Column>
              <Placeholder>
                <Placeholder.Line />
              </Placeholder>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Content>
    </Card>
  ),
];

class WrCardsList extends Component<Props, { pinToBottom: boolean }> {

  public readonly render = () => {
    const { deckId } = this.props.match.params;
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

  private readonly handleNewCard = () => {
    return null;
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
    const formattedMessages = (loading || !data || !data.cardsFromDeck)
      ? formattedLoadingCards
      : data.cardsFromDeck.map(({ id, front, back }: WrCard) => {
        return (
          <Card key={id}>
            <Card.Content>
              <Grid columns={2} divided={true}>
                <Grid.Row>
                  <Grid.Column>
                    {front}
                  </Grid.Column>
                  <Grid.Column>
                    {back}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Content>
          </Card>
        );
      });
    return (
      <>
        {/*<WrCardsListSubscriptionHelper subscribeToMore={subscribeToMore} />*/}
        <Card.Content>
          {formattedMessages}
          <WrNewCard />
        </Card.Content>
      </>
    );
  }
}

export default withRouter<OwnProps>(WrCardsList);
