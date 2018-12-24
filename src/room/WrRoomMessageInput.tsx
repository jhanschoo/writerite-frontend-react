import React, { Component, ChangeEvent } from 'react';

import { Card, Input } from 'semantic-ui-react';

import { withRouter, RouteComponentProps } from 'react-router';

import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import {
  ROOM_MESSAGE_CREATE,
  RoomMessageCreateData, RoomMessageCreateVariables,
} from './gqlTypes';
import { connect } from 'react-redux';
import { WrState } from '../store';
import { CurrentUser } from '../signin/actions';

type RoomDetailRouteProps = RouteComponentProps<{ roomId: string }>;

type OwnProps = RoomDetailRouteProps;

type DispatchProps = object;

interface StateProps {
  readonly user: CurrentUser | null;
}

type Props = StateProps & DispatchProps & OwnProps;

class WrRoomDetail extends Component<Props> {
  public state = {
    inputValue: '',
  };

  public readonly render = () => {
    const { inputBox } = this;
    return (
      <Mutation
        mutation={ROOM_MESSAGE_CREATE}
        onCompleted={this.handleMessageSent}
      >
        {inputBox}
      </Mutation>
    );
  }

  private readonly inputBox = (
    mutate: MutationFn<RoomMessageCreateData, RoomMessageCreateVariables>,
    { data, error, loading }: MutationResult<RoomMessageCreateData>,
  ) => {
    const { handleSendMessage, handleInputMessageChange } = this;
    const buttonProps = {
      loading,
      icon: (loading) ? undefined : 'play',
      primary: true,
      onClick: handleSendMessage(mutate),
    };
    return (
      <Card.Content>
        <Input
          fluid={true}
          placeholder="Write a message..."
          value={this.state.inputValue}
          onChange={handleInputMessageChange}
          action={buttonProps}
        />
      </Card.Content>
    );
  }

  private readonly handleInputMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  }

  private readonly handleSendMessage = (
    mutate: MutationFn<RoomMessageCreateData, RoomMessageCreateVariables>,
  ) => () => {
    const { roomId } = this.props.match.params;
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

const mapStateToProps = (state: WrState): StateProps => {
  const user = (state.signin && state.signin.data && state.signin.data.user) || null;
  return { user };
};

export default withRouter<OwnProps>(
  connect<StateProps, {}, OwnProps>(mapStateToProps)(WrRoomDetail),
);
