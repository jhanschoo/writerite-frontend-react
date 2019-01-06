import React, { Component } from 'react';
import { WrDeck } from './types';
import { Card } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

enum Display {
  SHOW,
  EDIT,
  CONFIRM_DELETE,
}

interface Props {
  deck: WrDeck;
}

interface State {
  display: Display;
  nameInput: string;
}

const initialState: State = {
  display: Display.SHOW,
  nameInput: '',
};

class WrDeckItem extends Component<Props, State> {
  public readonly state = initialState;

  public readonly render = () => {
    const { renderDeckItemShow } = this;
    const { display } = this.state;
    switch (display) {
      case Display.SHOW:
        return renderDeckItemShow();
      default:
        return null;
    }
  }

  private readonly renderDeckItemShow = () => {
    const { id, name, owner: { email } } = this.props.deck;
    return (
      <Card key={id} as={Link} from="/dashboard/deck" to={`/dashboard/deck/${id}`}>
        <Card.Content>
          <Card.Header>
            {name}
          </Card.Header>
          <Card.Meta>
            by {email}
          </Card.Meta>
        </Card.Content>
      </Card>
    );
  }
}

export default WrDeckItem;
