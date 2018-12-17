import React, { Component } from 'react';
import { RouteComponentProps, Redirect, Switch, Route } from 'react-router';
import { connect } from 'react-redux';
import { Container, Segment } from 'semantic-ui-react';

import DeckView from './DeckView';
import WrNavbar from './WrNavbar';

class DashboardView extends Component<RouteComponentProps<any>> {
  public render() {
    const { match } = this.props;
    return (
      <div>
        <Segment as="section" vertical={true} basic={true}>
          <Container>
            <WrNavbar />
          </Container>
        </Segment>
        <Switch>
          <Redirect from={match.url} exact={true} to={`${match.url}/deck`} />
          <Route path={`${match.url}/deck`} component={DeckView} />
        </Switch>
      </div>
    );
  }
}

export default connect()(DashboardView);
