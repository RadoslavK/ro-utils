import React from 'react';
import { TotalRefineCostResult } from '../../../../calculations/calculateTotalRefineCost';
import { RefineType } from '../../../../types/refineType.type';
import { RefineLevel } from './RefineLevel';

type Props = {
  readonly preferences: Map<number, string>;
  readonly onPreferencesChange: (preferences: Map<number, string>) => void;
  readonly refineType: RefineType;
  readonly result: TotalRefineCostResult;
  readonly startingRefineLevel: number;
}

export const RefineResult: React.FC<Props> = ({
  onPreferencesChange,
  preferences,
  refineType,
  result,
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

      <div style={{ display: 'flex', flexBasis: 500 }}>
        {result.totalRefineResults.map(levelResult => (
          <React.Fragment key={levelResult.refineLevel}>
            <RefineLevel
              level={levelResult.refineLevel}
              refineType={refineType}
              totalRefineResult={levelResult}
              onPreferredRefineParamsChange={setPreference(levelResult.refineLevel)}
              preferredRefineParamsId={preferences.get(levelResult.refineLevel)}
            />

            {levelResult.refineLevel === startingRefineLevel && (
              <div style={{ borderLeft: '6px solid green' }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

RefineResult.displayName = 'RefineResult';