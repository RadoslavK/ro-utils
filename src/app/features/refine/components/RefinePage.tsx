import React, { useMemo, useState } from 'react';
import { RefineCalculatorInput } from './RefineCalculatorInput';
import { calculateTotalRefineCost } from '../utils/calculateTotalRefineCost';
import { RefineResult } from './RefineResult';
import { useCosts } from '../hooks/useCosts';
import { useRefineInput } from '../hooks/useRefineInput';

export const RefinePage: React.FC = () => {
  const { costs, setCost } = useCosts();
  const { refineInput, setRefineInput } = useRefineInput();
  const [refineParamsPreferences, setRefineParamsPreferences] = useState<Map<number, string>>(new Map<number, string>());
  const [shouldExpandOnlyUsedResults, setShouldExpandOnlyUsedResults] = useState(true);

  const totalRefineResults = useMemo(() => calculateTotalRefineCost({
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
        onShouldExpandOnlyUsedResultsChange={setShouldExpandOnlyUsedResults}
        refineInput={refineInput}
        shouldExpandOnlyUsedResults={shouldExpandOnlyUsedResults}
      />

      <RefineResult
        onPreferencesChange={setRefineParamsPreferences}
        preferences={refineParamsPreferences}
        refineType={refineInput.refineType}
        shouldExpandOnlyUsedResults={shouldExpandOnlyUsedResults}
        totalRefineResults={totalRefineResults}
      />
    </div>
  );
};

RefinePage.displayName = 'RefinePage';