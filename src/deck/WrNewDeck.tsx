import React, { Component, ChangeEvent, createRef } from 'react';

import { MutationFn, Mutation, MutationResult } from 'react-apollo';
import { DeckCreateData, DeckCreateVariables, DECK_CREATE_MUTATION } from './gql';
import { printApolloError } from '../util';

import { Card, Input } from 'semantic-ui-react';

class WrNewDeck extends Component {
  public readonly state = {
    nameInput: '',
    showInput: false,
  };

  private readonly focusRef = createRef<Input>();

  public readonly componentDidUpdate = () => {
    const { showInput } = this.state;
    const { focusRef } = this;
    if (showInput && focusRef.current) {
      focusRef.current.focus();
    }
  }

  public readonly render = () => (
    <Mutation<DeckCreateData, DeckCreateVariables>
      mutation={DECK_CREATE_MUTATION}
      onError={printApolloError}
      onCompleted={this.resetState}
    >
      {this.renderCreateDeck}
    </Mutation>
  )

  public readonly renderCreateDeck = (
    mutate: MutationFn<DeckCreateData, DeckCreateVariables>,
    { loading }: MutationResult<DeckCreateData>,
  ) => {
    const { showInput, nameInput } = this.state;
    const { handleInputChange, handleCardClick, resetState, focusRef } = this;
    const handleNewDeck = () => {
      return mutate({
        variables: {
          name: nameInput,
        },
      });
    };
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          resetState();
          break;
        case 'Enter':
          handleNewDeck();
          break;
      }
    };
    const buttonProps = {
      loading,
      icon: (loading) ? undefined : 'play',
      primary: true,
      onClick: handleNewDeck,
    };
    if (showInput) {
      return (
        <Card key="new-deck-0" onKeyDown={handleKeyPress}>
          <Card.Content>
            <Card.Header>
              <Input
                fluid={true}
                value={nameInput}
                placeholder="Name..."
                onChange={handleInputChange}
                ref={focusRef}
                action={buttonProps}
              />
            </Card.Header>
          </Card.Content>
        </Card>
      );
    } else {
      return (
        <Card
          key="new-deck-0"
          onClick={handleCardClick}
        >
          <Card.Content>
            <Card.Header>
              New Deck
            </Card.Header>
          </Card.Content>
        </Card>
      );
    }
  }

  private readonly handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ nameInput: e.target.value });
  }

  private readonly handleCardClick = () => {
    this.setState({ showInput: true });
  }

  private readonly resetState = () => {
    this.setState({ showInput: false, nameInput: '' });
  }
}

export default WrNewDeck;
