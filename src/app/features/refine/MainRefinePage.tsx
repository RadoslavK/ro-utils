import React from 'react';
import { Redirect, Route, Switch, useLocation, useRouteMatch } from 'react-router';
import { RefinePage as RefinePageV1 } from './v1/components/RefinePage';
import { RefinePage as RefinePageV2 } from './v2/components/RefinePage';
import { css } from '@emotion/core';
import { Link } from 'react-router-dom';

const linkCss = css`
  color: blueviolet;
  margin-right: 8px;
  font-size: x-large;
  
  :link {
    text-decoration: none;
  };
`;

export const MainRefinePage: React.FC = () => {
  const location = useLocation();
  const { path, url } = useRouteMatch();

  return (
    <div>
      <div>
        <Link
          css={css`
            ${linkCss}
            ${location.pathname.includes('v1') && css`font-weight: bold`};
          `}
          to={`${url}/v1`}
        >
          v1
        </Link>
        <Link
          css={css`
            ${linkCss}
            ${location.pathname.includes('v2') && css`font-weight: bold`};
          `}
          to={`${url}/v2`}
        >
          v2
        </Link>
      </div>
      <Switch>
        <Route
          path={`${path}/v1`}
          component={RefinePageV1}
        />
        <Route
          path={`${path}/v2`}
          component={RefinePageV2}
        />
        <Redirect to={`${path}/v2`} />
      </Switch>
    </div>
  );
};

MainRefinePage.displayName = 'MainRefinePage';