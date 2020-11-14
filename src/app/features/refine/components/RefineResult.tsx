import React from 'react';
import { RefineType } from '../types/refineType.type';
import { RefineLevel } from './RefineLevel';
import { css } from '@emotion/core';
import { TotalRefineResult } from '../types/totalRefineResult.type';

type Props = {
  readonly onPreferencesChange: (preferences: Map<number, string>) => void;
  readonly preferences: Map<number, string>;
  readonly refineType: RefineType;
  readonly shouldExpandOnlyUsedResults: boolean;
  readonly totalRefineResults: readonly TotalRefineResult[];
}

export const RefineResult: React.FC<Props> = ({
  onPreferencesChange,
  preferences,
  refineType,
  shouldExpandOnlyUsedResults,
  totalRefineResults,
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
        {totalRefineResults.map(levelResult => (
          <React.Fragment key={levelResult.refineLevel}>
            <RefineLevel
              level={levelResult.refineLevel}
              onPreferredRefineParamsChange={setPreference(levelResult.refineLevel)}
              preferredRefineParamsId={preferences.get(levelResult.refineLevel)}
              refineType={refineType}
              shouldExpandOnlyUsedResults={shouldExpandOnlyUsedResults}
              totalRefineResult={levelResult}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

RefineResult.displayName = 'RefineResult';