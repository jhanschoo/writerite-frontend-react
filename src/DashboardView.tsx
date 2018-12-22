import React, { Component } from 'react';
import { RouteComponentProps, Redirect, Switch, Route } from 'react-router';
import { connect } from 'react-redux';

import { WrState } from './store';

import DeckView from './deck/DeckView';
import RoomView from './room/RoomView';
import { CurrentUser } from './signin/actions';

type OwnProps = RouteComponentProps;

type DispatchProps = object;

interface StateProps {
  readonly user: CurrentUser | null;
}

type Props = StateProps & DispatchProps & OwnProps;

class DashboardView extends Component<Props> {
  public readonly render = () => {
    const { match } = this.props;
    return (
      <Switch>
        <Redirect from={match.url} exact={true} to={`${match.url}/deck`} />
        <Route path={`${match.url}/deck`} component={DeckView} />
        <Route path={`${match.url}/room`} component={RoomView} />
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
