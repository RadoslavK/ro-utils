import React from 'react';
import { routes } from '../constants/routes';
import { Link } from 'react-router-dom';

export const Navigation: React.FC = () => (
  <>
    {routes.map(route => (
      <Link
        key={route.path}
        to={route.path}
      >
        {route.label}
      </Link>
    ))}
  </>
);