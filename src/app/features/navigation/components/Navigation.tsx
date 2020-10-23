import React from 'react';
import { routes } from '../constants/routes';
import { Link } from 'react-router-dom';
import { css } from '@emotion/core';

export const Navigation: React.FC = () => (
  <div>
    {routes.length > 1 && routes.map(route => (
      <Link
        css={css`
          font-size: x-large;
          :link {
            text-decoration: none;
          }
        `}
        key={route.path}
        to={route.path}
      >
        {route.label}
      </Link>
    ))}
  </div>
);