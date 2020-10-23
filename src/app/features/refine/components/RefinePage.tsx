import React, { useMemo, useState } from 'react';
import { RefineCalculatorInput } from './RefineCalculatorInput';
import { calculateTotalRefineCost } from '../../../../calculations/calculateTotalRefineCost';
import { RefineResult } from './RefineResult';
import { useCosts } from '../hooks/useCosts';
import { useRefineInput } from '../hooks/useRefineInput';

export const RefinePage: React.FC = () => {
  const { costs, setCost } = useCosts();
  const { refineInput, setRefineInput } = useRefineInput();
  const [refineParamsPreferences, setRefineParamsPreferences] = useState<Map<number, string>>(new Map<number, string>());
  const [shouldShowOnlyBestResults, setShouldShowOnlyBestResults] = useState(true);

  const refineResult = useMemo(() => calculateTotalRefineCost({
    itemCosts: costs,
    refineInput,
    refineParamsPreferences,
  }), [refineParamsPreferences, costs, refineInput]);

  return (
    <div>
      <RefineCalculatorInput
        itemCosts={costs}
        onItemCostChange={setCost}
        onRefineInputChange={setRefineInput}
        onShowOnlyBestResultsChange={setShouldShowOnlyBestResults}
        refineInput={refineInput}
        shouldShowOnlyBestResults={shouldShowOnlyBestResults}
      />

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