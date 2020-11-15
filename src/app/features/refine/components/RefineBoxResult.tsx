import React from 'react';
import { RefineType } from '../types/refineType.type';
import { RefineLevel } from './RefineLevel';
import { css } from '@emotion/core';
import { TotalRefineResult } from '../types/totalRefineResult.type';

type Props = {
  readonly results: readonly TotalRefineResult[];
  readonly refineType: RefineType;
  readonly shouldExpandOnlyUsedResults: boolean;
}

export const RefineBoxResult: React.FC<Props> = ({
  refineType,
  results,
  shouldExpandOnlyUsedResults,
}) => {
  return (
    <div css={css`
      display: flex;
      flex-wrap: wrap;
      flex-basis: 500px;
    `}>
      {results.map(levelResult => (
        <React.Fragment key={levelResult.refineLevel}>
          <RefineLevel
            level={levelResult.refineLevel}
            onPreferredRefineParamsChange={() => undefined}
            preferredRefineParamsId={undefined}
            refineType={refineType}
            shouldExpandOnlyUsedResults={shouldExpandOnlyUsedResults}
            totalRefineResult={levelResult}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

RefineBoxResult.displayName = 'RefineBoxResult';