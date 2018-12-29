import React from 'react';
import { Switch, Route, Redirect, withRouter, RouteComponentProps } from 'react-router';

import { connect } from 'react-redux';
import { WrState } from './store';
import { CurrentUser } from './signin/types';

import DashboardView from './DashboardView';
import HomeView from './HomeView';

type OwnProps = object;

type DispatchProps = object;

interface StateProps {
  readonly user: CurrentUser | null;
}


type Props = StateProps & DispatchProps & OwnProps & RouteComponentProps;

// tslint:disable-next-line: variable-name
const App = (props: Props) => {
  const { user } = props;
  return (
    <Switch>
      <Route path="/" exact={true} component={HomeView} />
      {user && <Route path="/dashboard" component={DashboardView} />}
      <Redirect to="/"/>
    </Switch>
  );
};

const mapStateToProps = (state: WrState): StateProps => {
  const user = (state.signin && state.signin.data && state.signin.data.user) || null;
  return { user };
};

// withRouter decorator necessary for routing to work properly.
// see: https://stackoverflow.com/questions/46036809
export default withRouter<OwnProps & RouteComponentProps>(
  connect<
    StateProps, {}, OwnProps & RouteComponentProps
  >(mapStateToProps)(App),
);
