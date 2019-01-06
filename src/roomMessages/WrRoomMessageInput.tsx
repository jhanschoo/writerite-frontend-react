import React, { Component, ChangeEvent } from 'react';

import { Card, Input } from 'semantic-ui-react';

import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import {
  ROOM_MESSAGE_CREATE,
  RoomMessageCreateData, RoomMessageCreateVariables,
} from './gql';
import { printApolloError } from '../util';

interface OwnProps {
  roomId: string;
}

type Props = OwnProps;

class WrRoomDetail extends Component<Props> {
  public readonly state = {
    inputValue: '',
  };

  public readonly render = () => {
    const { inputBox } = this;
    return (
      <Card.Content>
        <Mutation<RoomMessageCreateData, RoomMessageCreateVariables>
          mutation={ROOM_MESSAGE_CREATE}
          onCompleted={this.handleMessageSent}
          onError={printApolloError}
          ignoreResults={true}
        >
          {inputBox}
        </Mutation>
      </Card.Content>
    );
  }

  private readonly inputBox = (
    mutate: MutationFn<RoomMessageCreateData, RoomMessageCreateVariables>,
    { loading }: MutationResult<RoomMessageCreateData>,
  ) => {
    const { handleSendMessage, handleInputMessageChange } = this;
    const buttonProps = {
      loading,
      icon: (loading) ? undefined : 'play',
      primary: true,
      onClick: handleSendMessage(mutate),
    };
    return (
      <Input
        fluid={true}
        placeholder="Write a message..."
        value={this.state.inputValue}
        onChange={handleInputMessageChange}
        action={buttonProps}
      />
    );
  }

  private readonly handleInputMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  }

  private readonly handleSendMessage = (
    mutate: MutationFn<RoomMessageCreateData, RoomMessageCreateVariables>,
  ) => () => {
    const { roomId } = this.props;
    const { inputValue } = this.state;
    mutate({
      variables: {
        roomId,
        content: inputValue,
      },
    });
    return null;
  }

  private readonly handleMessageSent = (_data: RoomMessageCreateData) => {
    this.setState({ inputValue: '' });
  }
}

export default WrRoomDetail;
