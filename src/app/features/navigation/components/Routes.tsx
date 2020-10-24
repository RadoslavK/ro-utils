import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { routes } from '../constants/routes';

export const Routes: React.FC = () => (
  <Switch>
    {routes.map(route => (
      <Route
        key={route.path}
        path={`/${route.path}`}
        component={route.component}
      />
    ))}
    <Redirect to={routes[0].path}/>
  </Switch>
);