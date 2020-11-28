import React, { useState } from 'react';
import { RefineBoxResult } from '../utils/calculateRefineBox';
import { RefineResults } from './RefineResults';
import { RefineType } from '../types/refineType.type';
import { RefineBoxLevelResultsTab } from './RefineBoxLevelResultsTab';
import { css } from '@emotion/core';

type Props = {
  readonly refineType: RefineType;
  readonly results: RefineBoxResult;
};

export const RefineBoxResults: React.FC<Props> = (props) => {
  const { refineType, results } = props;

  const [selectedRefineBoxLevel, setSelectedRefineBoxLevel] = useState(() => [...results.boxLevelResults.keys()][0]);

  return (
    <div>
      <div
        css={css`
          margin-top: 16px;
          display: flex;
        `}
      >
        {[...results.boxLevelResults.entries()].map(([refineBoxLevel, refineBoxLevelResults]) => (
          <RefineBoxLevelResultsTab
            averageTotalCost={refineBoxLevelResults.averageTotalCost}
            chance={refineBoxLevelResults.chance}
            isSelected={refineBoxLevel === selectedRefineBoxLevel}
            level={refineBoxLevel}
            maxTotalCost={refineBoxLevelResults.maxTotalCost}
            minTotalCost={refineBoxLevelResults.minTotalCost}
            onClick={() => setSelectedRefineBoxLevel(refineBoxLevel)}
          />
        ))}
      </div>
      <RefineResults
        onPreferencesChange={() => undefined}
        preferences={new Map<number, string>()}
        refineType={refineType}
        results={results.boxLevelResults.get(selectedRefineBoxLevel).refineResults}
      />
    </div>
  );
};

RefineBoxResults.displayName = 'RefineBoxResults';