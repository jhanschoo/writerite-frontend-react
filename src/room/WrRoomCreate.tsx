import React, { Component, ChangeEvent, createRef, SyntheticEvent } from 'react';

import { MutationFn, Mutation, MutationResult, Query, QueryResult } from 'react-apollo';
import { RoomCreateData, RoomCreateVariables, ROOM_CREATE_MUTATION } from './gql';
import { printApolloError } from '../util';

import { Card, Input, Grid, Header, Button, Dropdown } from 'semantic-ui-react';
import WrTooltip from '../WrTooltip';
import { DecksData, DecksVariables, DECKS_QUERY } from '../deck/gql';

type Props = object;

interface State {
  nameInput: string;
  deckInput: string;
  showInput: boolean;
}

class WrNewRoom extends Component<Props, State> {
  public readonly state = {
    nameInput: '',
    deckInput: '',
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

  public readonly render = () => (
    <Mutation<RoomCreateData, RoomCreateVariables>
      mutation={ROOM_CREATE_MUTATION}
      onError={printApolloError}
      onCompleted={this.handleResetState}
    >
      {this.renderCreateRoom}
    </Mutation>
  )

  private readonly renderDropdown = ({
    loading, error, data,
  }: QueryResult<DecksData, DecksVariables>) => {
    const { handleDeckDropdownChange, focusRef } = this;
    if (error) {
      return null;
    }
    if (!loading && (!data || !data.rwDecks)) {
      return null;
    }
    const deckList = (loading || !data || !data.rwDecks)
      ? []
      : data.rwDecks.map((deck) => {
        return {
          text: deck.name,
          value: deck.id,
        };
      });
    return (
      <Dropdown
        fluid={true}
        placeholder="Select a deck..."
        search={true}
        searchInput={{ inputRef: focusRef }}
        selection={true}
        options={deckList}
        loading={loading}
        onChange={handleDeckDropdownChange}
      />
    );
  }

  private readonly renderCreateRoom = (
    mutate: MutationFn<RoomCreateData, RoomCreateVariables>,
    { loading }: MutationResult<RoomCreateData>,
  ) => {
    const { showInput, deckInput, nameInput } = this.state;
    const {
      handleNameInputChange, handleCardClick, handleResetState, renderDropdown,
    } = this;
    const handleNewRoom = () => {
      return mutate({
        variables: {
          name: nameInput,
          deckId: deckInput,
        },
      });
    };
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          this.setState({
            nameInput: '',
            showInput: false,
          });
          break;
        case 'Enter':
          handleNewRoom();
          break;
      }
    };
    if (showInput) {
      return (
        <Card key="new-room-0" onKeyDown={handleKeyPress}>
          <Card.Content>
            <Grid divided={true} stackable={true}>
              <Grid.Row>
                <Grid.Column width={6}>
                  <Header sub={true}>Deck</Header>
                  <Query<DecksData, DecksVariables>
                    query={DECKS_QUERY}
                    onError={printApolloError}
                  >
                    {renderDropdown}
                  </Query>
                </Grid.Column>
                <Grid.Column width={6}>
                  <Header sub={true}>Name</Header>
                  <Input
                    fluid={true}
                    value={nameInput}
                    placeholder="Name..."
                    onChange={handleNameInputChange}
                  />
                </Grid.Column>
                <Grid.Column width={4} textAlign="center">
                  <Button.Group>
                    <WrTooltip content="Cancel">
                      <Button
                        icon="undo"
                        onClick={handleResetState}
                      />
                    </WrTooltip>
                    <WrTooltip content="Confirm">
                      <Button
                        loading={loading}
                        icon={(loading) ? undefined : 'play'}
                        primary={true}
                        disabled={deckInput === ''}
                        onClick={handleNewRoom}
                      />
                    </WrTooltip>
                  </Button.Group>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Content>
        </Card>
      );
    } else {
      return (
        <Card
          key="new-room-0"
          onClick={handleCardClick}
        >
          <Card.Content>
            <Card.Header>
              New Room
            </Card.Header>
          </Card.Content>
        </Card>
      );
    }
  }

  private readonly handleNameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ nameInput: e.target.value });
  }

  private readonly handleDeckDropdownChange = (_e: SyntheticEvent<HTMLElement>, data: any) => {
    this.setState({ deckInput: data.value });
  }

  private readonly handleCardClick = () => {
    this.setState({ showInput: true });
  }

  private readonly handleResetState = () => {
    this.setState({ nameInput: '', deckInput: '', showInput: false });
  }
}

export default WrNewRoom;
