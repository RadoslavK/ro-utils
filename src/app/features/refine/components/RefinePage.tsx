import React, { useMemo, useState } from 'react';
import { Costs} from './Costs';
import { RefineCalculatorInput } from './RefineCalculatorInput';
import { calculateTotalRefineCost } from '../../../../calculations/calculateTotalRefineCost';
import { RefineResult } from './RefineResult';
import { useCosts } from '../hooks/useCosts';
import { useRefineInput } from '../hooks/useRefineInput';
import { css, jsx } from '@emotion/core';

export const RefinePage: React.FC = () => {
  const { costs, setCost } = useCosts();
  const { refineInput, setRefineInput } = useRefineInput();
  const [refineParamsPreferences, setRefineParamsPreferences] = useState<Map<number, string>>(new Map<number, string>());
  const [shouldShowOnlyBestResults, setShouldShowOnlyBestResults] = useState(false);

  const refineResult = useMemo(() => calculateTotalRefineCost({
    itemCosts: costs,
    refineInput,
    refineParamsPreferences,
  }), [refineParamsPreferences, costs, refineInput]);

  return (
    <div>
      <div css={css`display: flex`}>
        <RefineCalculatorInput
          refineInput={refineInput}
          onRefineInputChange={setRefineInput}
          onShowOnlyBestResultsChange={setShouldShowOnlyBestResults}
          shouldShowOnlyBestResults={shouldShowOnlyBestResults}
        />

        <Costs
          costs={costs}
          setCost={setCost}
        />
      </div>

      <RefineResult
        refineType={refineInput.refineType}
        result={refineResult}
        onPreferencesChange={setRefineParamsPreferences}
        preferences={refineParamsPreferences}
        shouldShowOnlyBestResults={shouldShowOnlyBestResults}
        startingRefineLevel={refineInput.startingRefineLevel}
      />
    </div>
  );
};

RefinePage.displayName = 'RefinePage';