import React from 'react';
import { TotalRefineCostResult } from '../utils/calculateTotalRefineCost';
import { RefineType } from '../types/refineType.type';
import { RefineLevel } from './RefineLevel';
import { css } from '@emotion/core';

type Props = {
  readonly hideLevelsBeforeStartingRefine: boolean;
  readonly onPreferencesChange: (preferences: Map<number, string>) => void;
  readonly preferences: Map<number, string>;
  readonly refineType: RefineType;
  readonly result: TotalRefineCostResult;
  readonly shouldExpandOnlyUsedResults: boolean;
  readonly startingRefineLevel: number;
}

export const RefineResult: React.FC<Props> = ({
  hideLevelsBeforeStartingRefine,
  onPreferencesChange,
  preferences,
  refineType,
  result,
  shouldExpandOnlyUsedResults,
  startingRefineLevel,
}) => {
  const setPreference = (refineLevel: number) => (refineParamsId: string | null): void => {
    const newPreferences = new Map<number, string>(preferences);

    if (refineParamsId !== null) {
      newPreferences.set(refineLevel, refineParamsId);
    }
    else {
      newPreferences.delete(refineLevel);
    }

    onPreferencesChange(newPreferences);
  };

  return (
    <div>
      <h2>Result</h2>

      <div css={css`
        display: flex;
        flex-wrap: wrap;
        flex-basis: 500px;
      `}>
        {result.totalRefineResults.map(levelResult => {
          const shouldShowLevel = !hideLevelsBeforeStartingRefine
            || levelResult.refineLevel > startingRefineLevel;

          return shouldShowLevel && (
            <React.Fragment key={levelResult.refineLevel}>
              <RefineLevel
                isCoveredByStartingRefine={levelResult.refineLevel <= startingRefineLevel}
                level={levelResult.refineLevel}
                onPreferredRefineParamsChange={setPreference(levelResult.refineLevel)}
                preferredRefineParamsId={preferences.get(levelResult.refineLevel)}
                refineType={refineType}
                shouldExpandOnlyUsedResults={shouldExpandOnlyUsedResults}
                totalRefineResult={levelResult}
              />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

RefineResult.displayName = 'RefineResult';