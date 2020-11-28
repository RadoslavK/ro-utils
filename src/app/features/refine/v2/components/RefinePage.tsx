import React, { useMemo, useState } from 'react';
import { useCosts } from '../../common/hooks/useCosts';
import { useRefineInput } from '../../common/hooks/useRefineInput';
import { RefineCalculatorInput } from './RefineCalculatorInput';
import { calculateUpgradeCost } from '../utils/calculateUpgradeCost';
import { RefineResults } from './RefineResults';

export const RefinePage: React.FC = () => {
  const { costs, setCost } = useCosts();
  const {
    refineInput,
    setRefineInput
  } = useRefineInput();
  const [refineParamsPreferences, setRefineParamsPreferences] = useState<ReadonlyMap<number, string>>(new Map<number, string>());

  const { results } = useMemo(() => {
    return calculateUpgradeCost({
      itemCosts: costs,
      refineInput,
      refineParamsPreferences,
    });
  }, [costs, refineInput, refineParamsPreferences]);

  return (
    <div>
      <RefineCalculatorInput
        itemCosts={costs}
        onItemCostChange={setCost}
        onRefineInputChange={setRefineInput}
        refineInput={refineInput}
      />
      <RefineResults
        onPreferencesChange={setRefineParamsPreferences}
        preferences={refineParamsPreferences}
        refineType={refineInput.refineType}
        results={results}
      />
    </div>
  );
};

RefinePage.displayName = 'RefinePage';