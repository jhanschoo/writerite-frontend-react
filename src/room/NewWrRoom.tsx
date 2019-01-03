import React, { Component, ChangeEvent, createRef } from 'react';

import { MutationFn, Mutation, MutationResult } from 'react-apollo';
import { RoomCreateData, RoomCreateVariables, ROOM_CREATE_MUTATION } from './gql';
import { printApolloError } from '../util';

import { Card, Input } from 'semantic-ui-react';

class WrNewRoom extends Component {
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
    <Mutation<RoomCreateData, RoomCreateVariables>
      mutation={ROOM_CREATE_MUTATION}
      onError={printApolloError}
    >
      {this.renderCreateRoom}
    </Mutation>
  )

  public readonly renderCreateRoom = (
    mutate: MutationFn<RoomCreateData, RoomCreateVariables>,
    { loading }: MutationResult<RoomCreateData>,
  ) => {
    const { showInput, nameInput } = this.state;
    const { handleInputChange, handleCardClick, focusRef } = this;
    const handleNewRoom = () => {
      return mutate({
        variables: {
          name: nameInput,
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
    const buttonProps = {
      loading,
      icon: (loading) ? undefined : 'play',
      primary: true,
      onClick: handleNewRoom,
    };
    if (showInput) {
      return (
        <Card key="new-room-0" onKeyDown={handleKeyPress}>
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

  private readonly handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ nameInput: e.target.value });
  }

  private readonly handleCardClick = () => {
    this.setState({ showInput: true });
  }
}

export default WrNewRoom;
