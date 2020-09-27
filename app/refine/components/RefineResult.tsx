import React from 'react';
import { TotalRefineCostResult } from '../../../calculations/calculateTotalRefineCost';
import { RefineType } from '../../../types/refineType.type';
import { RefineLevel } from './RefineLevel';

type Props = {
  readonly refineType: RefineType;
  readonly result: TotalRefineCostResult;
}

export const RefineResult: React.FC<Props> = ({
  refineType,
  result,
}) => {
  return (
    <div>
      <h2>Result</h2>

      {result.totalRefineResults.map(levelResult => (
        <RefineLevel
          key={levelResult.refineLevel}
          level={levelResult.refineLevel}
          refineType={refineType}
          totalRefineResult={levelResult}
        />
      ))}
    </div>
  );
};

RefineResult.displayName = 'RefineResult';