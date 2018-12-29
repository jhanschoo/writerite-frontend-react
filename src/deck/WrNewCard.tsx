import React, { Component } from 'react';

import { withRouter, RouteComponentProps } from 'react-router';

import { Mutation, MutationFn } from 'react-apollo';
import {
  NEW_CARD_MUTATION, NewCardData, NewCardVariables,
} from './gql';

import { Card } from 'semantic-ui-react';
import { printApolloError } from '../util';

type DeckDetailRouteProps = RouteComponentProps<{ deckId: string }>;

type OwnProps = DeckDetailRouteProps;
type Props = OwnProps;

interface State {
  pinToBottom: boolean;
}

class WrNewCard extends Component<Props, State> {
  public readonly render = () => {
    const { deckId } = this.props.match.params;
    const { renderButton } = this;
    return (
      <Mutation<NewCardData, NewCardVariables>
        mutation={NEW_CARD_MUTATION}
        variables={{ front: '', back: '', deckId }}
        onError={printApolloError}
      >
        {renderButton}
      </Mutation>
    );
  }

  private readonly renderButton = (
    mutate: MutationFn<NewCardData, NewCardVariables>) => {
    const handleNewCard = () => {
      return null;
    };
    return (
      <Card key="newCard" onClick={handleNewCard}>
        <Card.Content textAlign="center">
          <Card.Header>
            New Card
          </Card.Header>
        </Card.Content>
      </Card>
    );
  }
}

export default withRouter<OwnProps>(WrNewCard);
