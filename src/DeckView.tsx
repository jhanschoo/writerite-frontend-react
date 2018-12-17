import React, { Component } from 'react';
import { Container, Segment, Grid, Header } from 'semantic-ui-react';

import WrNavbar from './WrNavbar';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';

class DeckView extends Component<RouteComponentProps<any>> {
  public render() {
    return (
      <Segment as="section" vertical={true} basic={true}>
        <Container>
          <p>Deck stuff</p>
        </Container>
      </Segment>
    );
  }
}

export default connect()(DeckView);
