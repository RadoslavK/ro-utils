import React from 'react';
import { routes } from '../constants/routes';
import { Link, useLocation } from 'react-router-dom';
import { css } from '@emotion/core';

export const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <div>
      {routes.length > 1 && routes.map(route => {
        const isActive = location.pathname.includes(route.path);

        return (
          <Link
            css={css`
              color: blueviolet;
              margin-right: 8px;
              font-size: x-large;
              :link {
                text-decoration: none;
              }
              ${isActive && css`font-weight: bold`};
            `}
            key={route.path}
            to={`/${route.path}`}
          >
            {route.label}
          </Link>
        );
      })}
    </div>
  );
};