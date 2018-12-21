import React, { Component } from 'react';
import { RouteComponentProps, Redirect, Switch, Route } from 'react-router';
import { connect } from 'react-redux';

import { WrState } from './store';

import DeckView from './deck/DeckView';
import { User } from './signin/actions';

type OwnProps = RouteComponentProps<any>;

type DispatchProps = object;

interface StateProps {
  readonly user: User | null;
}

type Props = StateProps & DispatchProps & OwnProps;

class DashboardView extends Component<Props> {
  public readonly render = () => {
    const { match } = this.props;
    return (
      <Switch>
        <Redirect from={match.url} exact={true} to={`${match.url}/deck`} />
        <Route path={`${match.url}/deck`} component={DeckView} />
      </Switch>
    );
  }
}

const mapStateToProps = (state: WrState): StateProps => {
  const user = (state.signin && state.signin.data && state.signin.data.user) || null;
  return { user };
};

export default connect<
  StateProps, DispatchProps, OwnProps, WrState
>(mapStateToProps)(DashboardView);
