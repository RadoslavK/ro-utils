import React from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router';
import { routes } from '../constants/routes';

export const Routes: React.FC = () => {
  const location = useLocation();

  return (
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
};