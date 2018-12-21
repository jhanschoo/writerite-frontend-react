import React, { Component } from 'react';
import { Container, Segment, Grid, Header } from 'semantic-ui-react';

import WrNavbar from './WrNavbar';
import WrSignin from './signin/WrSignin';

class HomeView extends Component {
  public readonly render = () => {
    return (
      <div>
        <Segment as="section" vertical={true} basic={true}>
          <Container>
            <WrNavbar />
          </Container>
        </Segment>
        <Segment as="section" vertical={true} basic={true}>
          <Container>
            <Grid stackable={true} divided={true} container={true}>
              <Grid.Row>
                <Grid.Column width={9} textAlign="center" verticalAlign="middle">
                  <Header as="h1">
                    <em>Writerite</em> is for learning with flashcards and
                    friends.
                </Header>
                </Grid.Column>
                <Grid.Column width={7}>
                  <WrSignin />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Segment>
      </div>
    );
  }
}

export default HomeView;
