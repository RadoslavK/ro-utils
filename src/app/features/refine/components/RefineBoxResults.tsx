import React from 'react';
import { RefineType } from '../types/refineType.type';
import { RefineBoxCalculationResult } from '../utils/calculateRefineBox';
import { RefineBoxResult } from './RefineBoxResult';

type Props = {
  readonly refineBoxResults: RefineBoxCalculationResult;
  readonly refineType: RefineType;
  readonly shouldExpandOnlyUsedResults: boolean;
}

export const RefineBoxResults: React.FC<Props> = ({
  refineBoxResults,
  refineType,
  shouldExpandOnlyUsedResults,
}) => {
  const entries = [...refineBoxResults.refineBoxLevelResults.entries()];

  return (
    <div>
      Average cost: {Math.round(refineBoxResults.averageCost).toLocaleString()} Z
      <div>
        {entries.map(([level, results]) => (
          <React.Fragment key={level}>
            Chance to +{level}: {results.chance} %
            <RefineBoxResult
              results={results.totalRefineResults}
              refineType={refineType}
              shouldExpandOnlyUsedResults={shouldExpandOnlyUsedResults}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

RefineBoxResults.displayName = 'RefineBoxResults';