import React from 'react';
import { RefineLevelResult } from '../utils/calculateUpgradeCost';
import { RefineType } from '../../common/types/refineType.type';
import { css } from '@emotion/core';
import { RefineResult } from './RefineResult';

type Props = {
  readonly onPreferencesChange: (preferences: ReadonlyMap<number, string>) => void;
  readonly preferences: ReadonlyMap<number, string>;
  readonly refineType: RefineType;
  readonly results: ReadonlyMap<number, RefineLevelResult>;
};

export const RefineResults: React.FC<Props> = (props) => {
  const {
    onPreferencesChange,
    preferences,
    refineType,
    results,
  } = props;

  const onPreferenceChange = (refineLevel: number) => (refineParamsId: string): void => {
    const newPreferences = new Map<number, string>(preferences);

    newPreferences.set(refineLevel, refineParamsId);
    onPreferencesChange(newPreferences);
  };

  return (
    <div>
      <h2>Results</h2>
      <div
        css={css`
          display: flex;
          flex-wrap: wrap;
          flex-basis: 500px;
        `}
      >
        {[...results.entries()].map(([level, result]) => (
          <RefineResult
            key={level}
            level={level}
            onPreferredParamsChange={onPreferenceChange(level)}
            refineType={refineType}
            result={result}
          />
        ))}
      </div>
    </div>
  );
};

RefineResults.displayName = 'RefineResults';