import React, { useMemo, useState } from 'react';
import { css } from '@emotion/core';
import { AllRefineResults as AllRefineResultsModel } from '../utils/calculateAllRefineResults';
import { RefineResults } from './RefineResults';
import { RefineResultsTab } from './RefineResultsTab';
import { RefineType } from '../types/refineType.type';
import { RefineBoxResults } from './RefineBoxResults';
import { getLastUpgradeLevelUsedResult } from '../utils/getLastUpgradeLevelUsedResult';

type Props = {
  readonly allResults: AllRefineResultsModel;
  readonly onNoRefineBoxPreferencesChange: (preferences: Map<number, string>) => void;
  readonly noRefineBoxPreferences: ReadonlyMap<number, string>;
  readonly refineType: RefineType;
};

export const AllRefineResults: React.FC<Props> = (props: Props) => {
  const {
    allResults,
    noRefineBoxPreferences,
    onNoRefineBoxPreferencesChange,
    refineType,
  } = props;
  const [selectedRefineBoxTargetLevel, setSelectedRefineBoxTargetLevel] = useState<number | undefined>(undefined);

  const refineBoxKeys = useMemo(() => {
    return [...allResults.refineBoxesResults.keys()];
  }, [allResults.refineBoxesResults]);

  const noRefineBoxUpgradeResult = getLastUpgradeLevelUsedResult(allResults.noRefineBoxResults);

  return (
    <div>
      <h2>Results</h2>
      <div css={css`display: flex`}>
        <RefineResultsTab
          averageTotalCost={noRefineBoxUpgradeResult.average.totalCost}
          isSelected={selectedRefineBoxTargetLevel === undefined}
          label="No refine box"
          maxTotalCost={noRefineBoxUpgradeResult.max.totalCost}
          minTotalCost={noRefineBoxUpgradeResult.min.totalCost}
          onClick={() => setSelectedRefineBoxTargetLevel(undefined)}
        />
        {refineBoxKeys.map(targetRefineBoxLevel => {
          const refineBoxUpgradeResult = allResults.refineBoxesResults.get(targetRefineBoxLevel);

          return (
            <RefineResultsTab
              averageTotalCost={refineBoxUpgradeResult.averageCost}
              isSelected={selectedRefineBoxTargetLevel === targetRefineBoxLevel}
              key={targetRefineBoxLevel}
              label={`Refine box to +${targetRefineBoxLevel}`}
              maxTotalCost={refineBoxUpgradeResult.maxCost}
              minTotalCost={refineBoxUpgradeResult.minCost}
              onClick={() => setSelectedRefineBoxTargetLevel(targetRefineBoxLevel)}
            />
          );
        })}
      </div>
      {selectedRefineBoxTargetLevel === undefined && (
        <RefineResults
          onPreferencesChange={onNoRefineBoxPreferencesChange}
          preferences={noRefineBoxPreferences}
          refineType={refineType}
          results={allResults.noRefineBoxResults}
        />
      )}
      {selectedRefineBoxTargetLevel !== undefined && (
        <RefineBoxResults
          key={selectedRefineBoxTargetLevel}
          refineType={refineType}
          results={allResults.refineBoxesResults.get(selectedRefineBoxTargetLevel)}
        />
      )}
    </div>
  );
};

AllRefineResults.displayName = 'AllResults';