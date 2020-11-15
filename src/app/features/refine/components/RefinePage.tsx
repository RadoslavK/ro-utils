import React, { useMemo, useState } from 'react';
import { RefineCalculatorInput } from './RefineCalculatorInput';
import { calculateTotalRefineCost, clearCalculationResults } from '../utils/calculateTotalRefineCost';
import { useCosts } from '../hooks/useCosts';
import { useRefineInput } from '../hooks/useRefineInput';
import { RefineResults } from './RefineResults';
import { calculateAllRefineBoxes } from '../utils/calculateAllRefineBoxes';

export const RefinePage: React.FC = () => {
  const { costs, setCost } = useCosts();
  const {
    refineInput,
    setRefineInput
  } = useRefineInput();
  const [refineParamsPreferences, setRefineParamsPreferences] = useState<Map<number, string>>(new Map<number, string>());
  const [shouldExpandOnlyUsedResults, setShouldExpandOnlyUsedResults] = useState(true);

  const {
    baseItemCost,
    refineType,
    targetRefineLevel,
  } = refineInput;

  const {
    allRefineBoxResults,
    noRefineBoxResults,
  } = useMemo(() => {
    clearCalculationResults();

    const noRefineBoxResults = calculateTotalRefineCost({
      itemCosts: costs,
      baseItemCost,
      refineType,
      targetRefineLevel,
      refineParamsPreferences,
    });

    const allRefineBoxResults = calculateAllRefineBoxes({
      baseItemCost,
      itemCosts: costs,
      refineType,
      targetRefineLevel,
    });

    return {
      allRefineBoxResults,
      noRefineBoxResults,
    };
  }, [refineParamsPreferences, costs,  baseItemCost, refineType, targetRefineLevel]);

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

      <RefineResults
        allRefineBoxesResults={allRefineBoxResults}
        itemCosts={costs}
        noRefineBoxResults={noRefineBoxResults}
        onPreferencesChange={setRefineParamsPreferences}
        preferences={refineParamsPreferences}
        refineInput={refineInput}
        shouldExpandOnlyUsedResults={shouldExpandOnlyUsedResults}
      />
    </div>
  );
};

RefinePage.displayName = 'RefinePage';