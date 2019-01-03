import React, { Component, createRef, ChangeEvent } from 'react';
import { Card, Grid, Button, Input, Header } from 'semantic-ui-react';
import {
  CardEditData, CardEditVariables, CARD_EDIT_MUTATION,
  CardDeleteVariables, CardDeleteData, CARD_DELETE_MUTATION,
} from './gql';
import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import { printApolloError } from '../util';
import WrTooltip from '../WrTooltip';

interface Props {
  id: string;
  front: string;
  back: string;
  deckId: string;
}

interface State {
  frontInput: string;
  backInput: string;
  showInput: boolean;
}

class WrCardItem extends Component<Props, State> {
  public readonly state = {
    frontInput: '',
    backInput: '',
    showInput: false,
  };

  private readonly focusRef = createRef<Input>();

  public readonly componentDidUpdate = (_prevProps: Props, prevState: State) => {
    const { showInput: prevShowInput } = prevState;
    const { showInput } = this.state;
    const { focusRef } = this;
    if (!prevShowInput && showInput && focusRef.current) {
      focusRef.current.focus();
    }
  }

  public readonly render = () => {
    const { renderCardItem, handleResetState } = this;
    return (
      <Mutation<CardEditData, CardEditVariables>
        mutation={CARD_EDIT_MUTATION}
        onError={printApolloError}
        onCompleted={handleResetState}
      >
        {renderCardItem}
      </Mutation>
    );
  }

  private readonly renderCardDelete = (
    mutate: MutationFn<CardDeleteData, CardDeleteVariables>,
    { loading }: MutationResult<CardDeleteData>,
  ) => {
    const { id } = this.props;
    const handleClick = () => {
      mutate({
        variables: { id },
      });
    };
    return (
      <WrTooltip content="Delete">
        <Button
          loading={loading}
          icon="trash"
          color="red"
          onClick={handleClick}
        />
      </WrTooltip>
    );
  }

  private readonly renderCardItem = (
    mutate: MutationFn<CardEditData, CardEditVariables>,
    { loading }: MutationResult<CardEditData>,
  ) => {
    const { id, front, back, deckId } = this.props;
    const { showInput, frontInput, backInput } = this.state;
    const {
      handleFrontInputChange, handleBackInputChange,
      handleShowInput, handleResetState, handleSwapSides,
      focusRef, renderCardDelete,
    } = this;
    const handleCardCreate = () => {
      return mutate({
        variables: {
          id,
          front: frontInput,
          back: backInput,
          deckId,
        },
      });
    };
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          handleResetState();
          break;
        case 'Enter':
          handleCardCreate();
          break;
      }
    };
    const formattedFrontInput = (showInput)
      ? (
        <Input
          fluid={true}
          value={frontInput}
          placeholder="Front..."
          ref={focusRef}
          onChange={handleFrontInputChange}
        />
      )
      : front;
    const formattedBackInput = (showInput)
      ? (
        <Input
          fluid={true}
          value={backInput}
          placeholder="Back..."
          onChange={handleBackInputChange}
        />
      )
      : back;
    const formattedButtons = (showInput)
      ? (
        <>
          <WrTooltip content="Cancel">
            <Button
              icon="undo"
              onClick={handleResetState}
            />
          </WrTooltip>
          <WrTooltip content="Swap front and back">
            <Button
              icon="exchange"
              onClick={handleSwapSides}
            />
          </WrTooltip>
          <WrTooltip content="Confirm">
            <Button
              loading={loading}
              icon={(loading) ? undefined : 'play'}
              primary={true}
              onClick={handleCardCreate}
            />
          </WrTooltip>
        </>
      )
      : (
        <>
          <WrTooltip content="Edit">
            <Button
              icon="edit"
              primary={true}
              onClick={handleShowInput}
            />
          </WrTooltip>
          <Mutation<CardDeleteData, CardDeleteVariables>
            mutation={CARD_DELETE_MUTATION}
            onError={printApolloError}
          >
            {renderCardDelete}
          </Mutation>
        </>
      );
    return (
      <Card key={id} onKeyDown={handleKeyPress}>
        <Card.Content>
          <Grid divided={true} stackable={true}>
            <Grid.Row>
              <Grid.Column width={6}>
                <Header sub={true}>Front</Header>
                {formattedFrontInput}
              </Grid.Column>
              <Grid.Column width={6}>
                <Header sub={true}>Back</Header>
                {formattedBackInput}
              </Grid.Column>
              <Grid.Column width={4} textAlign="center">
                <Button.Group>
                  {formattedButtons}
                </Button.Group>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Content>
      </Card>
    );
  }

  private readonly handleFrontInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ frontInput: e.target.value });
  }

  private readonly handleBackInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ backInput: e.target.value });
  }

  private readonly handleShowInput = () => {
    const { front, back } = this.props;
    this.setState({ showInput: true, frontInput: front, backInput: back });
  }

  private readonly handleResetState = () => {
    this.setState({ showInput: false, frontInput: '', backInput: '' });
  }

  private readonly handleSwapSides = () => {
    const { frontInput, backInput } = this.state;
    this.setState({ frontInput: backInput, backInput: frontInput });
  }
}

export default WrCardItem;
