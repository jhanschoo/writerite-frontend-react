import React, { PureComponent } from 'react';
import WrDeckList from './WrDeckList';
import { RouteComponentProps, Switch, Route, withRouter } from 'react-router';

class DeckView extends PureComponent<RouteComponentProps> {
  public readonly render = () => {
    const { match } = this.props;
    return (
      <Switch>
        <Route path={`${match.url}`} exact={true} component={WrDeckList} />
      </Switch>
    );
  }
}

export default withRouter<RouteComponentProps>(DeckView);
