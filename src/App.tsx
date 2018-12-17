import React from 'react';
import { Switch, Route } from 'react-router';

import DashboardView from './DashboardView';
import HomeView from './HomeView';

// tslint:disable-next-line: variable-name
const App = () => {
  return (
    <Switch>
      <Route path="/dashboard" component={DashboardView} />
      <Route path="/" exact={true} component={HomeView} />
    </Switch>
  );
};

export default App;
